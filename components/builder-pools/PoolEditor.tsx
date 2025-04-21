import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { useChainId } from 'wagmi';
import { SUPPORTED_CHAINS } from '../../utils/networkSwitching';
import { TransactionStatus } from './TransactionStatus';
import { parseEther } from 'viem';

interface PoolEditorProps {
    poolId: `0x${string}`;
    currentRewardSplit: number;
    currentMinStake: bigint;
    currentMaxParticipants: number;
    isOwner: boolean;
}

export const PoolEditor: React.FC<PoolEditorProps> = ({
    poolId,
    currentRewardSplit,
    currentMinStake,
    currentMaxParticipants,
    isOwner
}) => {
    const chainId = useChainId();
    const { contract, isError } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    const [rewardSplit, setRewardSplit] = useState(currentRewardSplit);
    const [minStake, setMinStake] = useState(currentMinStake.toString());
    const [maxParticipants, setMaxParticipants] = useState(currentMaxParticipants);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

    if (!isOwner) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;

        try {
            setIsSubmitting(true);
            setError(null);

            const tx = await contract.write.updatePoolSettings([
                poolId,
                rewardSplit,
                parseEther(minStake),
                maxParticipants
            ]);

            setTxHash(tx);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update pool settings');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccess = () => {
        // Optionally refresh pool data or show success message
    };

    const handleError = (error: Error) => {
        setError(error.message);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Edit Pool Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="rewardSplit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reward Split (%)
                    </label>
                    <input
                        type="number"
                        id="rewardSplit"
                        value={rewardSplit}
                        onChange={(e) => setRewardSplit(Number(e.target.value))}
                        min="0"
                        max="100"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="minStake" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Minimum Stake (MOR)
                    </label>
                    <input
                        type="text"
                        id="minStake"
                        value={minStake}
                        onChange={(e) => setMinStake(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Maximum Participants
                    </label>
                    <input
                        type="number"
                        id="maxParticipants"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update Pool Settings'}
                </button>
            </form>

            {txHash && (
                <TransactionStatus
                    hash={txHash}
                    onSuccess={handleSuccess}
                    onError={handleError}
                />
            )}
        </motion.div>
    );
}; 