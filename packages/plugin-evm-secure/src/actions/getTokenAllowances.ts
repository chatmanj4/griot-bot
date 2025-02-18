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
import { getTokenAllowanceExamples } from "../examples";
import { createTokenService } from "../services";

export const getTokenAllowancesAction: Action = {
    name: "GET_TOKEN_ALLOWANCES",
    similes: [
        "CHECK_ALLOWANCES",
        "TOKEN_PERMISSIONS",
        "CONTRACT_APPROVALS",
        "REVIEW_PERMISSIONS"
    ],
    description: "Check token allowances and permissions for a provided Ethereum address.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validate config is present
        await validateEVMSecureConfig(runtime);
        
        // Validate message contains an Ethereum address
        const text = (message.content as { text: string }).text;
        const addressRegex = /0x[a-fA-F0-9]{40}/;
        return addressRegex.test(text);
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const config = await validateEVMSecureConfig(runtime);
        const tokenService = createTokenService({
            rpcUrl: config.RPC_URL,
            etherscanApiKey: config.ETHERSCAN_API_KEY,
            chainId: config.CHAIN_ID
        });

        try {
            // Extract address from message
            const text = (message.content as { text: string }).text;
            const addressMatch = text.match(/0x[a-fA-F0-9]{40}/);
            
            if (!addressMatch) {
                throw new Error("No valid Ethereum address found in message");
            }

            const address = addressMatch[0];

            // Get allowances
            const allowanceData = await tokenService.getTokenAllowances(address);
            elizaLogger.success(
                `Successfully fetched token allowances for ${address}`
            );

            // Format response message
            const responseMessage = tokenService.formatAllowanceMessage(allowanceData);

            if (callback) {
                callback({
                    text: responseMessage,
                    content: {
                        allowances: allowanceData,
                        address: address,
                        chainId: config.CHAIN_ID
                    }
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in token allowance handler:", error);
            
            // Provide user-friendly error message
            const errorMessage = error.message.includes('Invalid Ethereum address')
                ? "Please provide a valid Ethereum address."
                : `Error checking token allowances: ${error.message}`;

            callback({
                text: errorMessage,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getTokenAllowanceExamples as ActionExample[][],
} as Action;