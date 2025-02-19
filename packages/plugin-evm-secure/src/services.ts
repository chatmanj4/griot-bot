import { providers, Contract, utils } from 'ethers';
import {
    TokenAllowance,
    AllowanceResponse,
    TokenContract,
    SpenderInfo,
    ERC20_ABI,
    KNOWN_SPENDERS
} from './types';

const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

const UNLIMITED_APPROVAL_VALUES = {
    MAX_UINT256: "115792089237316195423570985008687907853269984665640564039457584007913129639935", // 2^256 - 1
    MAX_UINT128: "340282366920938463463374607431768211455", // 2^128 - 1
    MAX_UINT96:  "79228162514264337593543950335", // 2^96 - 1
    MAX_UINT64:  "18446744073709551615", // 2^64 - 1
    TYPE_MAX_UINT: "115792089237316195423570985008687907853269984665640564039457584007913129639935", // Same as MAX_UINT256, used by TypeScript
};

const formatAllowanceAmount = (amount: string, decimals: number): string => {
    // Check for any unlimited approval values
    if (Object.values(UNLIMITED_APPROVAL_VALUES).includes(amount)) {
        return "Unlimited";
    }
    return utils.formatUnits(amount, decimals);
};

export const createTokenService = (config: {
    rpcUrl: string;
    etherscanApiKey: string;
    chainId: number;
}) => {
    const provider = new providers.JsonRpcProvider(config.rpcUrl);

    const getTokenMetadata = async (tokenAddress: string): Promise<TokenContract> => {
        try {
            const contract = new Contract(tokenAddress, ERC20_ABI, provider);
            
            const [symbol, name, decimals] = await Promise.all([
                contract.symbol(),
                contract.name(),
                contract.decimals()
            ]);

            return {
                address: tokenAddress,
                symbol,
                name,
                decimals
            };
        } catch (error) {
            console.error(`Error fetching token metadata for ${tokenAddress}:`, error);
            return {
                address: tokenAddress,
                symbol: 'UNKNOWN',
                name: 'Unknown Token',
                decimals: 18
            };
        }
    };

    const fetchTokenTransactions = async (address: string): Promise<string[]> => {
        try {
            const url = `${ETHERSCAN_BASE_URL}?module=account&action=tokentx&address=${address}&sort=desc&apikey=${config.etherscanApiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Etherscan API error: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.status === '1') {
                const transactions = data.result;
                const uniqueTokens = new Set<string>();
                
                transactions.forEach((tx: { contractAddress: string }) => {
                    uniqueTokens.add(tx.contractAddress.toLowerCase());
                });

                return Array.from(uniqueTokens);
            }
            return [];
        } catch (error) {
            console.error('Error fetching token transactions:', error);
            throw error;
        }
    };

    const checkAllowance = async (
        tokenAddress: string,
        ownerAddress: string,
        spenderAddress: string
    ): Promise<string> => {
        try {
            const contract = new Contract(tokenAddress, ERC20_ABI, provider);
            const allowance = await contract.allowance(ownerAddress, spenderAddress);
            return allowance.toString();
        } catch (error) {
            console.error('Error checking allowance:', error);
            return '0';
        }
    };

    const getTokenAllowances = async (address: string): Promise<AllowanceResponse> => {
        if (!utils.isAddress(address)) {
            throw new Error("Invalid Ethereum address");
        }

        try {
            // Get tokens the address has interacted with
            const tokenAddresses = await fetchTokenTransactions(address);
            const allowances: TokenAllowance[] = [];

            // Process in batches
            const batchSize = 5;
            for (let i = 0; i < tokenAddresses.length; i += batchSize) {
                const batch = tokenAddresses.slice(i, i + batchSize);
                const batchPromises = batch.map(async (tokenAddress) => {
                    const contract = new Contract(tokenAddress, ERC20_ABI, provider);
                    const tokenMetadata = await getTokenMetadata(tokenAddress);

                    // Query all historical Approval events for this owner
                    const filter = contract.filters.Approval(address, null);
                    const events = await contract.queryFilter(filter);

                    // Get the most recent approval for each spender
                    const spenderAllowances = new Map<string, string>();
                    for (const event of events) {
                        const spender = event.args?.[1];
                        // Check current allowance for this spender
                        const currentAllowance = await checkAllowance(
                            tokenAddress,
                            address,
                            spender
                        );
                        if (currentAllowance !== '0') {
                            spenderAllowances.set(spender, currentAllowance);
                        }
                    }

                    // Convert to response format
                    return Array.from(spenderAllowances.entries()).map(([spender, amount]) => ({
                        token: tokenAddress,
                        spender,
                        amount,
                        symbol: tokenMetadata.symbol,
                        name: tokenMetadata.name,
                        decimals: tokenMetadata.decimals,
                        spenderInfo: KNOWN_SPENDERS[spender] || {
                            name: 'Unknown Protocol',
                            protocol: 'Unknown',
                            risk: 'Unknown'
                        }
                    }));
                });

                const batchResults = await Promise.all(batchPromises);
                allowances.push(...batchResults.flat());

                // Add delay between batches
                if (i + batchSize < tokenAddresses.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            return {
                address,
                allowances,
                timestamp: Date.now(),
                chainId: config.chainId
            };
        } catch (error: any) {
            console.error("Token allowance check error:", error.message);
            throw error;
        }
    };

    const formatAllowanceMessage = (allowanceData: AllowanceResponse): string => {
        if (allowanceData.allowances.length === 0) {
            return `No significant token allowances found for ${allowanceData.address}`;
        }

        let message = `Found ${allowanceData.allowances.length} token allowances for ${allowanceData.address}:\n\n`;
        
        allowanceData.allowances.forEach((allowance) => {
            const spenderInfo = KNOWN_SPENDERS[allowance.spender];
            const formattedAmount = formatAllowanceAmount(allowance.amount, allowance.decimals || 18);
            
            message += `${allowance.symbol || 'Token'} (${allowance.name || 'Unknown'}):\n`;
            message += `- Spender: ${spenderInfo?.name || allowance.spender}\n`;
            message += `- Protocol: ${spenderInfo?.protocol || 'Unknown'}\n`;
            message += `- Amount: ${formattedAmount}\n`;
            if (spenderInfo?.risk) {
                message += `- Risk Level: ${spenderInfo.risk}\n`;
            }
            message += '\n';
        });

        return message;
    };

    return {
        getTokenAllowances,
        formatAllowanceMessage
    };
};