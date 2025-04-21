import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { formatEther, type Hash } from 'viem';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { SUPPORTED_CHAINS } from '../../utils/networkSwitching';
import { TransactionStatus } from '../builder-pools/TransactionStatus';
import { GasEstimator } from '../staking/GasEstimator';

interface ClaimInterfaceProps {
    claimableAmount: bigint;
    onClaimSuccess?: () => void;
}

export const ClaimInterface: React.FC<ClaimInterfaceProps> = ({
    claimableAmount,
    onClaimSuccess
}) => {
    const { address } = useAccount();
    const chainId = useChainId();
    const { contract: builderContract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<Hash | null>(null);

    const handleClaim = async () => {
        if (!address || !builderContract) return;

        try {
            setIsLoading(true);
            setError(null);

            // Estimate gas for the claim transaction
            const gasEstimate = await builderContract.estimateGas.claimRewards([address as `0x${string}`]);
            
            // Execute the claim transaction
            const tx = await builderContract.write.claimRewards(
                [address as `0x${string}`],
                { gasLimit: (gasEstimate * 110n) / 100n } // Add 10% buffer
            );

            setTxHash(tx);
            
            // Wait for transaction confirmation
            const receipt = await tx.wait();
            
            if (receipt.status === 'success') {
                onClaimSuccess?.();
            }
        } catch (err) {
            console.error('Error claiming rewards:', err);
            setError('Failed to claim rewards. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Claim Your Rewards
            </h2>
            
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                        Available to Claim
                    </span>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {formatEther(claimableAmount)} MOR
                    </span>
                </div>

                {/* Gas Estimation */}
                <GasEstimator
                    contractFunction={builderContract?.estimateGas.claimRewards}
                    args={[address as `0x${string}`]}
                />

                {/* Claim Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClaim}
                    disabled={isLoading || claimableAmount <= 0n}
                    className={`
                        w-full py-3 px-4 rounded-lg font-medium text-white
                        ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : claimableAmount <= 0n
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }
                    `}
                >
                    {isLoading ? 'Claiming...' : 'Claim Rewards'}
                </motion.button>

                {/* Transaction Status */}
                {txHash && (
                    <TransactionStatus
                        hash={txHash}
                        onSuccess={() => {
                            setTxHash(null);
                            onClaimSuccess?.();
                        }}
                    />
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </motion.div>
    );
}; 