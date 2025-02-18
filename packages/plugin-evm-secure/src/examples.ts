import { ActionExample } from "@elizaos/core";

export const getTokenAllowanceExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you check what token approvals I have for 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check the token allowances for this address.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What contracts have I approved for my wallet 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch your token approvals and check which contracts have permission to spend your tokens.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I'm worried about my token permissions.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I can help you check your token allowances. Could you provide your wallet address?",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check all token approvals for your wallet address.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I need to audit my DeFi permissions.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I can help you review your DeFi protocol approvals. What's your wallet address?",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll analyze your token allowances and show you which protocols have spending permissions.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you tell me if any protocols have unlimited approval for my tokens? Address is 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check all your token allowances and highlight any unlimited approvals.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Show me all my token approvals for Uniswap.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll need your wallet address to check your Uniswap token approvals.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Here it is: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll fetch all your token allowances and highlight the Uniswap-related approvals.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I want to do a security check on my wallet 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll help you review your wallet security by checking all token allowances.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Which tokens have I approved for spending?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I can help you check your token approvals. Please share your wallet address.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check all the tokens you've approved for spending.",
                action: "GET_TOKEN_ALLOWANCES",
            },
        }
    ]
];