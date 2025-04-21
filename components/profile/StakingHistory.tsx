import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

interface StakingEvent {
    id: string;
    type: 'stake' | 'unstake' | 'claim';
    amount: bigint;
    timestamp: number;
    poolId: `0x${string}`;
    poolName: string;
    transactionHash: `0x${string}`;
}

interface StakingHistoryProps {
    events?: StakingEvent[];
    isLoading?: boolean;
    address: `0x${string}`;
}

export const StakingHistory: React.FC<StakingHistoryProps> = ({
    events = [],
    isLoading = false,
    address
}) => {
    const [filteredEvents, setFilteredEvents] = useState<StakingEvent[]>([]);
    const [filter, setFilter] = useState<'all' | 'stake' | 'unstake' | 'claim'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        let sorted = [...events];
        
        // Apply filter
        if (filter !== 'all') {
            sorted = sorted.filter(event => event.type === filter);
        }
        
        // Apply sorting
        sorted.sort((a, b) => {
            if (sortBy === 'newest') {
                return b.timestamp - a.timestamp;
            }
            return a.timestamp - b.timestamp;
        });
        
        setFilteredEvents(sorted);
    }, [events, filter, sortBy]);

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
                    Please connect your wallet to view staking history
                </p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                    No staking history found
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
            {/* Filters and Sorting */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as typeof filter)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="all">All Events</option>
                        <option value="stake">Stakes</option>
                        <option value="unstake">Unstakes</option>
                        <option value="claim">Claims</option>
                    </select>
                    
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className={`
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${event.type === 'stake' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                      event.type === 'unstake' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                                `}>
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    Pool: {event.poolName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatEther(event.amount)} MOR
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
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