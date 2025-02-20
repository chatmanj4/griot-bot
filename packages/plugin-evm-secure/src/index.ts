import type { Plugin } from "@elizaos/core";
import { getTokenAllowancesAction } from "./actions/getTokenAllowances";
import { checkContractSafetyAction } from "./actions/checkContractSafety";

export const evmSecurePlugin: Plugin = {
    name: "evmSecure",
    description:"Security capabilities plugin for EVM",
    actions: [getTokenAllowancesAction, checkContractSafetyAction],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default evmSecurePlugin;
