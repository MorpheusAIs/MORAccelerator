import React from 'react';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from 'recharts';

interface RewardAnalyticsProps {
    totalEarned: bigint;
    pendingRewards: bigint;
    lastClaimTime: number;
    activePools: number;
}

interface ChartDataPoint {
    timestamp: number;
    amount: number;
}

export const RewardAnalytics: React.FC<RewardAnalyticsProps> = ({
    totalEarned,
    pendingRewards,
    lastClaimTime,
    activePools
}) => {
    // Convert timestamps to readable dates
    const lastClaimDate = new Date(lastClaimTime * 1000).toLocaleDateString();
    
    // Calculate some derived metrics
    const averageRewardsPerPool = activePools > 0
        ? Number(formatEther(totalEarned)) / activePools
        : 0;

    // Generate sample data for the chart (replace with actual historical data)
    const generateSampleData = (): ChartDataPoint[] => {
        const data: ChartDataPoint[] = [];
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        for (let i = 30; i >= 0; i--) {
            data.push({
                timestamp: now - (i * dayInMs),
                amount: Number(formatEther(totalEarned)) * (1 - i/30)
            });
        }
        
        return data;
    };

    const chartData = generateSampleData();

    const formatXAxis = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatTooltipLabel = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatTooltipValue = (value: number) => {
        return [`${value.toFixed(4)} MOR`, 'Rewards'];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Reward Analytics
            </h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Average Rewards per Pool
                    </h3>
                    <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {averageRewardsPerPool.toFixed(4)} MOR
                    </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Claim Date
                    </h3>
                    <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {lastClaimDate}
                    </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pending vs Total Ratio
                    </h3>
                    <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {totalEarned > 0n
                            ? ((Number(pendingRewards) / Number(totalEarned)) * 100).toFixed(2)
                            : '0'}%
                    </p>
                </div>
            </div>

            {/* Rewards Over Time Chart */}
            <div className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={formatTooltipLabel}
                            formatter={formatTooltipValue}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Additional Analytics */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Performance Insights
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg
                            className="w-5 h-5 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Active in {activePools} pool{activePools !== 1 ? 's' : ''}
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg
                            className="w-5 h-5 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        {Number(formatEther(totalEarned)).toFixed(4)} MOR earned in total
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg
                            className="w-5 h-5 mr-2 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {Number(formatEther(pendingRewards)).toFixed(4)} MOR pending
                    </li>
                </ul>
            </div>
        </motion.div>
    );
}; 