import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEther, parseEther } from 'viem';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useChainId } from 'wagmi';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';

interface StakingCalculatorProps {
    poolId?: `0x${string}`;
    rewardSplit?: number;
}

export const StakingCalculator: React.FC<StakingCalculatorProps> = ({
    poolId,
    rewardSplit = 70 // Default 70% reward split if not provided
}) => {
    const chainId = useChainId();
    const { contract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    const [stakeAmount, setStakeAmount] = useState('');
    const [duration, setDuration] = useState('30'); // Default 30 days
    const [estimatedRewards, setEstimatedRewards] = useState<bigint>(BigInt(0));
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const calculateRewards = async () => {
            if (!stakeAmount || !duration || !contract) return;

            try {
                setIsCalculating(true);
                setError(null);

                const amount = parseEther(stakeAmount);
                const durationInSeconds = BigInt(parseInt(duration) * 24 * 60 * 60);
                
                // Calculate base rewards (this is a simplified calculation)
                // In reality, this would come from the contract based on current pool metrics
                const baseRewardRate = BigInt(10); // 10% base APR
                const timeRatio = (durationInSeconds * BigInt(100)) / BigInt(365 * 24 * 60 * 60);
                const baseRewards = (amount * baseRewardRate * timeRatio) / BigInt(10000);
                
                // Apply reward split
                const finalRewards = (baseRewards * BigInt(rewardSplit)) / BigInt(100);
                
                setEstimatedRewards(finalRewards);
            } catch (err) {
                setError('Error calculating rewards. Please try again.');
                console.error('Calculation error:', err);
            } finally {
                setIsCalculating(false);
            }
        };

        calculateRewards();
    }, [stakeAmount, duration, contract, rewardSplit]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Rewards Calculator
            </h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stake Amount (MOR)
                    </label>
                    <input
                        type="number"
                        id="stakeAmount"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter amount to stake"
                        min="0"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lock Duration (days)
                    </label>
                    <select
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="365">365 days</option>
                    </select>
                </div>

                {error && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </p>
                )}

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Estimated Rewards:</span>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {isCalculating ? (
                                <span className="animate-pulse">Calculating...</span>
                            ) : (
                                `${formatEther(estimatedRewards)} MOR`
                            )}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Based on {rewardSplit}% reward split and current pool metrics
                    </p>
                </div>
            </div>
        </motion.div>
    );
}; 