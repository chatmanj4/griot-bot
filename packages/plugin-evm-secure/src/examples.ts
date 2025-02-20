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
export const checkContractSafetyExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this contract safe? 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll analyze this contract for security concerns.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you audit 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll perform a security analysis of this contract.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you audit this contract 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8 on sepolia",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll analyze this contract's security on the Sepolia network.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Check if this Sepolia contract is safe: 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll perform a security analysis of this contract on Sepolia.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this contract vulnerable? 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8 (on sepolia testnet)",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check for vulnerabilities in this contract on the Sepolia testnet.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "analyze contract security sepolia 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll conduct a security analysis of this contract on Sepolia.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "please check contract 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8 on the sepolia network for security issues",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll examine this contract on Sepolia for potential security concerns.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "run security audit on sepolia contract 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll run a security audit on this Sepolia contract.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "review smart contract 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8 sepolia network",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll review this smart contract's security on the Sepolia network.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "can you help me check if this sepolia contract is safe? 0x36A5FaBc0cAe3034E67F51147c1D8C49228880c8",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll help you check if this contract on Sepolia has any security issues.",
                action: "CHECK_CONTRACT_SAFETY",
            },
        }
    ]
];