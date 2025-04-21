import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

interface RewardEvent {
    id: string;
    amount: bigint;
    timestamp: number;
    poolId: `0x${string}`;
    poolName: string;
    transactionHash: `0x${string}`;
    rewardType: 'builder' | 'staker';
}

interface RewardHistoryProps {
    events?: RewardEvent[];
    isLoading?: boolean;
    address: `0x${string}`;
}

export const RewardHistory: React.FC<RewardHistoryProps> = ({
    events = [],
    isLoading = false,
    address
}) => {
    const [filteredEvents, setFilteredEvents] = useState<RewardEvent[]>([]);
    const [filter, setFilter] = useState<'all' | 'builder' | 'staker'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

    // Calculate total rewards
    const totalRewards = events.reduce((sum, event) => sum + event.amount, BigInt(0));
    
    // Calculate rewards by type
    const builderRewards = events
        .filter(event => event.rewardType === 'builder')
        .reduce((sum, event) => sum + event.amount, BigInt(0));
    
    const stakerRewards = events
        .filter(event => event.rewardType === 'staker')
        .reduce((sum, event) => sum + event.amount, BigInt(0));

    useEffect(() => {
        let filtered = [...events];
        
        // Apply type filter
        if (filter !== 'all') {
            filtered = filtered.filter(event => event.rewardType === filter);
        }
        
        // Apply time range filter
        if (timeRange !== 'all') {
            const now = Date.now();
            const ranges = {
                week: 7 * 24 * 60 * 60 * 1000,
                month: 30 * 24 * 60 * 60 * 1000,
                year: 365 * 24 * 60 * 60 * 1000
            };
            filtered = filtered.filter(event => 
                now - (event.timestamp * 1000) <= ranges[timeRange]
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return b.timestamp - a.timestamp;
            }
            return a.timestamp - b.timestamp;
        });
        
        setFilteredEvents(filtered);
    }, [events, filter, sortBy, timeRange]);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
            </div>
        );
    }

    if (!address) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                    Please connect your wallet to view reward history
                </p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                    No reward history found
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-surface rounded-lg shadow-lg p-4 border border-dark-surface/20"
                >
                    <h3 className="text-sm font-medium text-dark-onBg/70">
                        Total Rewards
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-dark-onBg">
                        {formatEther(totalRewards)} MOR
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-surface rounded-lg shadow-lg p-4 border border-dark-surface/20"
                >
                    <h3 className="text-sm font-medium text-dark-onBg/70">
                        Builder Rewards
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-dark-primary">
                        {formatEther(builderRewards)} MOR
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-dark-surface rounded-lg shadow-lg p-4 border border-dark-surface/20"
                >
                    <h3 className="text-sm font-medium text-dark-onBg/70">
                        Staker Rewards
                    </h3>
                    <p className="mt-2 text-2xl font-semibold text-dark-secondary">
                        {formatEther(stakerRewards)} MOR
                    </p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="rounded-md bg-dark-bg border-dark-surface/20 shadow-sm focus:border-dark-primary focus:ring-dark-primary text-dark-onBg"
                >
                    <option value="all">All Rewards</option>
                    <option value="builder">Builder Rewards</option>
                    <option value="staker">Staker Rewards</option>
                </select>

                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                    className="rounded-md bg-dark-bg border-dark-surface/20 shadow-sm focus:border-dark-primary focus:ring-dark-primary text-dark-onBg"
                >
                    <option value="all">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-md bg-dark-bg border-dark-surface/20 shadow-sm focus:border-dark-primary focus:ring-dark-primary text-dark-onBg"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-dark-surface rounded-lg shadow-lg p-4 border border-dark-surface/20"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className={`
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${event.rewardType === 'builder' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                                `}>
                                    {event.rewardType.charAt(0).toUpperCase() + event.rewardType.slice(1)} Reward
                                </span>
                                <p className="mt-1 text-sm text-dark-onBg">
                                    Pool: {event.poolName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-dark-onBg">
                                    {formatEther(event.amount)} MOR
                                </p>
                                <p className="text-sm text-dark-onBg/70">
                                    {new Date(event.timestamp * 1000).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 text-sm">
                            <a
                                href={`https://arbiscan.io/tx/${event.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View Transaction
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}; 