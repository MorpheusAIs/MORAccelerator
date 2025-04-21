import React, { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { formatEther, type Hash } from 'viem';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { useTreasuryContract } from '../../hooks/useTreasuryContract';
import { SUPPORTED_CHAINS } from '../../utils/networkSwitching';
import { ClaimInterface } from './ClaimInterface';
import { RewardAnalytics } from './RewardAnalytics';
import { type BuilderPool } from '../../contracts/types/contracts';

interface RewardStats {
    totalEarned: bigint;
    pendingRewards: bigint;
    claimableRewards: bigint;
    lastClaimTime: number;
    activePools: number;
}

export const RewardsDashboard: React.FC = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { contract: builderContract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    const { contract: treasuryContract } = useTreasuryContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    const [stats, setStats] = useState<RewardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRewardStats = async () => {
            if (!address || !builderContract || !treasuryContract) return;

            try {
                setIsLoading(true);
                setError(null);

                // Fetch active pools for the user
                const pools = await builderContract.read.getUserPools([address as `0x${string}`]) as `0x${string}`[];
                
                // Calculate total and pending rewards across all pools
                let totalEarned = 0n;
                let pendingRewards = 0n;
                let claimableRewards = 0n;
                let lastClaimTime = 0;

                for (const pool of pools) {
                    const poolRewards = await builderContract.read.getPendingRewards([pool, address as `0x${string}`]) as bigint;
                    const poolStats = await builderContract.read.getStakerStats([pool, address as `0x${string}`]) as { totalEarned: bigint; lastClaimTime: bigint; isClaimable: boolean };
                    
                    pendingRewards += poolRewards;
                    totalEarned += poolStats.totalEarned;
                    lastClaimTime = Math.max(lastClaimTime, Number(poolStats.lastClaimTime));
                    
                    if (poolStats.isClaimable) {
                        claimableRewards += poolRewards;
                    }
                }

                setStats({
                    totalEarned,
                    pendingRewards,
                    claimableRewards,
                    lastClaimTime,
                    activePools: pools.length
                });
            } catch (err) {
                setError('Failed to load reward statistics');
                console.error('Error loading rewards:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadRewardStats();
    }, [address, builderContract, treasuryContract]);

    if (!isConnected) {
        return (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p className="text-gray-600 dark:text-gray-400">
                    Connect your wallet to view your rewards
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Earned
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                        {stats ? formatEther(stats.totalEarned) : '0'} MOR
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pending Rewards
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                        {stats ? formatEther(stats.pendingRewards) : '0'} MOR
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Claimable Now
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                        {stats ? formatEther(stats.claimableRewards) : '0'} MOR
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Pools
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                        {stats?.activePools || 0}
                    </p>
                </motion.div>
            </div>

            {/* Claim Interface */}
            {stats && stats.claimableRewards > 0n && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ClaimInterface
                        claimableAmount={stats.claimableRewards}
                        onClaimSuccess={() => {
                            // Refresh stats after successful claim
                            window.location.reload();
                        }}
                    />
                </motion.div>
            )}

            {/* Analytics */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <RewardAnalytics
                        totalEarned={stats.totalEarned}
                        pendingRewards={stats.pendingRewards}
                        lastClaimTime={stats.lastClaimTime}
                        activePools={stats.activePools}
                    />
                </motion.div>
            )}

            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                </div>
            )}
        </motion.div>
    );
}; 