export interface Config {
    rpcUrl?: string;
    etherscanApiKey?: string;
    etherscanBaseUrl?: string;
    chainId?: number;
}

export interface TokenAllowance {
    token: string;
    spender: string;
    amount: string;
    symbol?: string;
    name?: string;
    decimals?: number;
}

export interface TokenContract {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface SpenderInfo {
    address: string;
    name: string;
    protocol: string;
    risk?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TokenTransaction {
    contractAddress: string;
    from: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
}

export interface AllowanceResponse {
    address: string;
    allowances: TokenAllowance[];
    timestamp: number;
    chainId: number;
}

export interface ElizaResponse {
    message: string;
    data?: AllowanceResponse;
    error?: string;
}

// Common protocol addresses and their info
export const KNOWN_SPENDERS: Record<string, SpenderInfo> = {
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': {
        address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        name: 'Uniswap V2 Router',
        protocol: 'Uniswap',
        risk: 'LOW'
    },
    '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': {
        address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        name: 'Uniswap V3 Router',
        protocol: 'Uniswap',
        risk: 'LOW'
    }
};

// ABI types
export const ERC20_ABI = [
    {
        constant: true,
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function'
    },
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const;