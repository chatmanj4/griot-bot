import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const evmSecureEnvSchema = z.object({
    RPC_URL: z.string().min(1, "RPC URL is required"),
    ETHERSCAN_API_KEY: z.string().min(1, "Etherscan API key is required"),
    CHAIN_ID: z.string().transform((val) => parseInt(val, 10)).pipe(
        z.number().min(1, "Chain ID must be a positive number")
    ),
    // Optional settings with defaults
    MAX_ALLOWANCE_CHECK: z.string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().positive())
        .default("100"),
    BLOCK_SCAN_RANGE: z.string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().positive())
        .default("10000")
});

export type EVMSecureConfig = z.infer<typeof evmSecureEnvSchema>;

export async function validateEVMSecureConfig(
    runtime: IAgentRuntime
): Promise<EVMSecureConfig> {
    try {
        const config = {
            RPC_URL: runtime.getSetting("RPC_URL"),
            ETHERSCAN_API_KEY: runtime.getSetting("ETHERSCAN_API_KEY"),
            CHAIN_ID: runtime.getSetting("CHAIN_ID"),
            MAX_ALLOWANCE_CHECK: runtime.getSetting("MAX_ALLOWANCE_CHECK"),
            BLOCK_SCAN_RANGE: runtime.getSetting("BLOCK_SCAN_RANGE")
        };
        
        console.log('EVM Secure config: ', {
            ...config,
            RPC_URL: config.RPC_URL.slice(0, 20) + '...' // Log partial RPC URL for security
        });
        
        return evmSecureEnvSchema.parse(config);
    } catch (error) {
        console.log("EVM Secure config error:", error);
        
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            
            throw new Error(
                `EVM Secure configuration validation failed:\n${errorMessages}`
            );
        }
        
        throw error;
    }
}

// Chain ID to network name mapping for logging and display
export const CHAIN_NAMES: { [key: number]: string } = {
    1: "Ethereum Mainnet",
    5: "Goerli Testnet",
    11155111: "Sepolia Testnet",
    137: "Polygon Mainnet",
    80001: "Polygon Mumbai",
    42161: "Arbitrum One",
    10: "Optimism",
    56: "BNB Smart Chain",
    43114: "Avalanche C-Chain"
};

// Helper function to get network name from chain ID
export function getNetworkName(chainId: number): string {
    return CHAIN_NAMES[chainId] || `Unknown Network (${chainId})`;
}