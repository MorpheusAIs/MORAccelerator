import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork, useAccount, useContractRead } from 'wagmi';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface RewardsTrackerProps {
    builderId: string;
}

interface RewardHistory {
    timestamp: number;
    amount: string;
}

export const RewardsTracker: React.FC<RewardsTrackerProps> = ({ builderId }) => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
    const [totalRewards, setTotalRewards] = useState<string>('0');
    const [projectedAPY, setProjectedAPY] = useState<number>(0);

    // Get network configuration
    const networkConfig = chain ? SUPPORTED_NETWORKS[chain.network] : null;

    // Contract reads
    const { data: pendingRewards } = useContractRead({
        address: networkConfig?.contracts.builder as `0x${string}`,
        abi: ['function getPendingRewards(bytes32,address) view returns (uint256)'],
        functionName: 'getPendingRewards',
        args: [builderId, address],
    });

    const { data: stakeInfo } = useContractRead({
        address: networkConfig?.contracts.builder as `0x${string}`,
        abi: ['function getStakeInfo(bytes32,address) view returns (tuple(uint256,uint256,uint256,uint256,bool))'],
        functionName: 'getStakeInfo',
        args: [builderId, address],
    });

    // Calculate projected rewards and APY
    useEffect(() => {
        if (stakeInfo && pendingRewards) {
            const stakedAmount = Number(ethers.utils.formatEther(stakeInfo.amount));
            const currentRewards = Number(ethers.utils.formatEther(pendingRewards));
            
            // Calculate daily rate based on current rewards
            const dailyRate = currentRewards / 30; // Assuming monthly reward period
            const yearlyRewards = dailyRate * 365;
            const calculatedAPY = (yearlyRewards / stakedAmount) * 100;
            
            setProjectedAPY(calculatedAPY);
        }
    }, [stakeInfo, pendingRewards]);

    // Prepare chart data
    const chartData: ChartData<'line'> = {
        labels: rewardHistory.map(h => new Date(h.timestamp * 1000).toLocaleDateString()),
        datasets: [
            {
                label: 'Rewards Earned (MOR)',
                data: rewardHistory.map(h => Number(h.amount)),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Rewards History'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Rewards Tracker</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-700">Pending Rewards</h3>
                    <p className="text-2xl font-bold text-blue-900">
                        {pendingRewards ? ethers.utils.formatEther(pendingRewards) : '0'} MOR
                    </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700">Total Earned</h3>
                    <p className="text-2xl font-bold text-green-900">
                        {totalRewards} MOR
                    </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-700">Projected APY</h3>
                    <p className="text-2xl font-bold text-purple-900">
                        {projectedAPY.toFixed(2)}%
                    </p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Rewards History</h3>
                <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-4">Staking Details</h3>
                {stakeInfo && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Staked Amount</p>
                            <p className="font-medium">
                                {ethers.utils.formatEther(stakeInfo.amount)} MOR
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Lock Status</p>
                            <p className="font-medium">
                                {stakeInfo.isLocked ? (
                                    <span className="text-yellow-600">Locked</span>
                                ) : (
                                    <span className="text-green-600">Unlocked</span>
                                )}
                            </p>
                        </div>
                        {stakeInfo.isLocked && (
                            <div className="col-span-2">
                                <p className="text-gray-600">Lock End Date</p>
                                <p className="font-medium">
                                    {new Date(Number(stakeInfo.lockEnd) * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>Network: {chain?.name || 'Not connected'}</p>
                <p>Connected Address: {address || 'Not connected'}</p>
            </div>
        </div>
    );
};

export default RewardsTracker;