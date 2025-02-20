/**
 * @fileoverview This file contains the contract safety service.
 * It is used to analyze a contract for security concerns.
 * It is used in the checkContractSafety action.
 * 
 * Many of the checks are based on the following sources:
 * https://swcregistry.io/
 * https://consensys.github.io/smart-contract-best-practices/attacks/
 * https://www.cobalt.io/blog/smart-contract-security-risks#:~:text=Smart%20contracts%20that%20make%20external,withdrawals%20or%20introduce%20malicious%20code.
 */

import { ethers } from 'ethers';
import { Config } from '../types';

interface SecurityAnalysis {
    address: string;
    isVerified: boolean;
    contractName?: string;
    hasProxy: boolean;
    proxyImplementation?: string;
    deploymentDate?: Date;
    issues: SecurityIssue[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    securityScore: number;
    warnings: string[];
}

interface SecurityIssue {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
}

export const createContractSafetyService = (config: Config) => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

    const checkVerificationStatus = async (address: string): Promise<{
        isVerified: boolean;
        contractName?: string;
        sourceCode?: string;
    }> => {
        const url = `${config.etherscanBaseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${config.etherscanApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && data.result[0]) {
            return {
                isVerified: data.result[0].SourceCode !== '',
                contractName: data.result[0].ContractName,
                sourceCode: data.result[0].SourceCode
            };
        }
        return { isVerified: false };
    };

    const checkProxyStatus = async (address: string) => {
        // EIP-1967
        const eip1967Slot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
        // EIP-1822 UUPS
        const eip1822Slot = '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7';
        // OpenZeppelin's Transparent Proxy
        const adminSlot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';
    
        try {
            const implementations = await Promise.all([
                provider.getStorageAt(address, eip1967Slot),
                provider.getStorageAt(address, eip1822Slot),
                provider.getStorageAt(address, adminSlot)
            ]);
    
            for (const impl of implementations) {
                if (impl !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
                    return {
                        isProxy: true,
                        implementation: '0x' + impl.slice(-40)
                    };
                }
            }
            
            return { isProxy: false };
        } catch (error) {
            return { isProxy: false };
        }
    };

    const checkKnownVulnerabilities = async (
        address: string,
        sourceCode?: string
    ): Promise<SecurityIssue[]> => {
        const issues: SecurityIssue[] = [];

        // Check bytecode for known vulnerable patterns
        const bytecode = await provider.getCode(address);

        // Check for delegatecall usage
        if (bytecode.includes('f4') && sourceCode?.includes('delegatecall')) {
            issues.push({
                type: 'DELEGATECALL',
                severity: 'HIGH',
                description: 'Contract uses delegatecall which can be dangerous if not properly secured'
            });
        }

        // Check for selfdestruct
        if (bytecode.includes('ff') && sourceCode?.includes('selfdestruct')) {
            issues.push({
                type: 'SELFDESTRUCT',
                severity: 'HIGH',
                description: 'Contract contains selfdestruct capability'
            });
        }

        if (sourceCode) {
            // Check for dangerous receive() functions that can change ownership
            const hasReceiveFunction = sourceCode.includes('receive()') || sourceCode.includes('fallback()');
            const hasOwnershipChange = sourceCode.includes('owner =') || sourceCode.includes('_owner =');
            const usesMsgSender = sourceCode.includes('msg.sender');
            
            if (hasReceiveFunction && hasOwnershipChange && usesMsgSender) {
                // Check if ownership change happens in receive/fallback context
                const receiveRegex = /receive\s*\(\s*\)\s*external\s+payable\s*{[^}]*owner\s*=[^}]*}/s;
                const fallbackRegex = /fallback\s*\(\s*\)\s*external\s+payable\s*{[^}]*owner\s*=[^}]*}/s;
                
                if (receiveRegex.test(sourceCode) || fallbackRegex.test(sourceCode)) {
                    issues.push({
                        type: 'DANGEROUS_RECEIVE',
                        severity: 'HIGH',
                        description: 'Contract contains a receive/fallback function that can modify ownership - potential for ownership hijacking'
                    });
                }
            }
        }
        return issues;
    };

    const getDeploymentInfo = async (address: string): Promise<Date | undefined> => {
        try {
            const txUrl = `${config.etherscanBaseUrl}?module=account&action=txlist&address=${address}&page=1&offset=1&sort=asc&apikey=${config.etherscanApiKey}`;
            const response = await fetch(txUrl);
            const data = await response.json();

            if (data.status === '1' && data.result[0]) {
                return new Date(parseInt(data.result[0].timeStamp) * 1000);
            }
        } catch (error) {
            console.error('Error getting deployment info:', error);
        }
        return undefined;
    };

    //TODO: Security score logic is a work in progress
    //More time should be spent on validating the weighting/scoring
    const calculateSecurityScore = (analysis: Partial<SecurityAnalysis>): number => {
        let score = 100;

        // Major deduction for unverified contracts
        //Cannot verify the contracts source code
        if (!analysis.isVerified) score -= 40;
        
        // Small deduction for proxy patterns (due to upgrade risks)
        //Common upgrade pattern for proxies
        if (analysis.hasProxy) score -= 10;
        
        const highSeverityIssues = analysis.issues?.filter(i => i.severity === 'HIGH') || [];
        const mediumSeverityIssues = analysis.issues?.filter(i => i.severity === 'MEDIUM') || [];
        const lowSeverityIssues = analysis.issues?.filter(i => i.severity === 'LOW') || [];
        
        // Exponential penalty for HIGH severity issues
        if (highSeverityIssues.length > 0) {
            // First high severity issue has major impact
            score -= 40;
            // Additional high severity issues have exponential impact
            if (highSeverityIssues.length > 1) {
                score -= (highSeverityIssues.length - 1) * 30;
            }
        }
        
        // Linear penalties for medium and low severity issues
        score -= (mediumSeverityIssues.length * 15);
        score -= (lowSeverityIssues.length * 5);

        return Math.max(0, score);
    };

    const analyzeContract = async (address: string): Promise<SecurityAnalysis> => {
        if (!ethers.utils.isAddress(address)) {
            throw new Error('Invalid contract address');
        }
        // Check if address is actually a contract
        const code = await provider.getCode(address);
        if (code === '0x') {
            throw new Error('No contract found at this address');
        }

        // Perform all checks in parallel
        const [
            verificationInfo,
            proxyInfo,
            deploymentDate
        ] = await Promise.all([
            checkVerificationStatus(address),
            checkProxyStatus(address),
            getDeploymentInfo(address)
        ]);

        // Check for vulnerabilities if source code is available
        const issues = await checkKnownVulnerabilities(address, verificationInfo.sourceCode);

        const analysis: SecurityAnalysis = {
            address,
            isVerified: verificationInfo.isVerified,
            contractName: verificationInfo.contractName,
            hasProxy: proxyInfo.isProxy,
            proxyImplementation: proxyInfo.implementation,
            deploymentDate,
            issues,
            riskLevel: 'UNKNOWN',
            securityScore: 0,
            warnings: []
        };

        // Calculate security score
        analysis.securityScore = calculateSecurityScore(analysis);

        // Determine risk level
        if (analysis.securityScore >= 80) {
            analysis.riskLevel = 'LOW';
        } else if (analysis.securityScore >= 50) {
            analysis.riskLevel = 'MEDIUM';
        } else {
            analysis.riskLevel = 'HIGH';
        }

        // Generate warnings
        if (!analysis.isVerified) {
            analysis.warnings.push('Contract is not verified on Etherscan');
        }
        if (analysis.hasProxy) {
            analysis.warnings.push(`Contract is a proxy. Implementation at: ${analysis.proxyImplementation}`);
        }
        if (analysis.issues.length > 0) {
            analysis.warnings.push(`Found ${analysis.issues.length} potential security issues`);
        }

        return analysis;
    };

    const formatAnalysisMessage = (analysis: SecurityAnalysis): string => {
        let message = `Security Analysis for ${analysis.contractName || analysis.address}\n\n`;
        
        message += `Security Score: ${analysis.securityScore}/100\n`;
        message += `Risk Level: ${analysis.riskLevel == 'HIGH' ? '🚨 HIGH' : analysis.riskLevel}\n\n`;

        if (analysis.deploymentDate) {
            message += `Deployed: ${analysis.deploymentDate.toLocaleDateString()}\n`;
        }

        message += `Verification: ${analysis.isVerified ? '✅ Verified' : '❌ Not Verified'}\n`;
        
        if (analysis.hasProxy) {
            message += `Proxy Status: This is a proxy contract\n`;
            message += `Implementation: ${analysis.proxyImplementation}\n`;
        }

        if (analysis.issues.length > 0) {
            message += '\nPotential Issues:\n';
            analysis.issues.forEach(issue => {
                message += `- [${issue.severity}] ${issue.type}: ${issue.description}\n`;
            });
        }

        if (analysis.warnings.length > 0) {
            message += '\nWarnings:\n';
            analysis.warnings.forEach(warning => {
                message += `- ${warning}\n`;
            });
        }

        return message;
    };

    return {
        analyzeContract,
        formatAnalysisMessage
    };
};