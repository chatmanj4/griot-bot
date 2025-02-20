import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { validateEVMSecureConfig } from "../environment";
import { createContractSafetyService } from "../services/contractSafetyService";
import { Config } from "../types";
import { checkContractSafetyExamples } from "../examples";

const NETWORKS: Record<string, Config> = {
    'ethereum': {
        rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
        etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
        chainId: 1,
        etherscanBaseUrl: 'https://api.etherscan.io/api'
    },
    'sepolia': {
        rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
        etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
        chainId: 11155111,
        etherscanBaseUrl: 'https://api-sepolia.etherscan.io/api'
    }
};

export const checkContractSafetyAction: Action = {
    name: "CHECK_CONTRACT_SAFETY",
    similes: [
        "ANALYZE_CONTRACT",
        "CONTRACT_SECURITY",
        "AUDIT_CONTRACT",
        "CHECK_SMART_CONTRACT"
    ],
    description: "Analyze a smart contract for potential security issues.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        try {
            await validateEVMSecureConfig(runtime);
            const text = (message.content as { text: string }).text;
            return /0x[a-fA-F0-9]{40}/.test(text);
        } catch (error) {
            elizaLogger.error("Validation error:", error);
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        try {
            const config = await validateEVMSecureConfig(runtime);
            const text = (message.content as { text: string }).text;
            const addressMatch = text.match(/0x[a-fA-F0-9]{40}/);
            
            if (!addressMatch) {
                throw new Error("No valid contract address found");
            }
            const address = addressMatch[0];
            
            // Determine network based on message content
            const network = text.toLowerCase().includes('sepolia') ? 'sepolia' : 'ethereum';
            const networkConfig = NETWORKS[network];

            if (!networkConfig.rpcUrl) {
                throw new Error(`RPC URL not configured for ${network}`);
            }

            const contractService = createContractSafetyService(networkConfig);

            const analysis = await contractService.analyzeContract(address);
            
            elizaLogger.success(
                `Successfully analyzed contract ${address} on ${network}`
            );

            const responseMessage = contractService.formatAnalysisMessage(analysis);

            if (callback) {
                callback({
                    text: responseMessage,
                    content: {
                        analysis,
                        address,
                        network
                    }
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in contract safety check:", error);
            
            callback({
                text: `Error analyzing contract: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
        return false;
    },
    examples: checkContractSafetyExamples as ActionExample[][],
} as Action;