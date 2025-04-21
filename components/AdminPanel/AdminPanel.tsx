import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { useTreasuryContract } from '../../hooks/useTreasuryContract';
import { handleContractError } from '../../utils/contractErrors';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../../utils/networkSwitching';
import { BuilderPool } from '../../contracts/types/contracts';
import ClientOnly from '../common/ClientOnly';

interface AdminStats {
    totalPools: number;
    totalStaked: bigint;
    totalRewards: bigint;
}

interface DisplayBuilderPool extends BuilderPool {
    poolId: `0x${string}`; // Used as identifier for display purposes
    initialStake: bigint;
    minStake: bigint;
    maxStake: bigint;
    stakersCount: number;
}

const AdminPanel = () => {
    const chainId = useChainId();
    const { address } = useAccount();
    const [builderPools, setBuilderPools] = useState<DisplayBuilderPool[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const builderContract = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    const treasuryContract = useTreasuryContract(chainId || SUPPORTED_CHAINS.ARBITRUM);

    // Fix hydration issues - only render on client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const loadBuilderPools = useCallback(async () => {
        if (!builderContract || !treasuryContract || !chainId || !isNetworkSupported(chainId) || !isClient) return;

        try {
            setLoading(true);
            setError(null);

            // For demo purposes, use mock data
            const mockPools: DisplayBuilderPool[] = [
                {
                    poolId: '0x1234567890123456789012345678901234567890123456789012345678901234',
                    name: 'AI Agents Builder Pool',
                    owner: '0x0000000000000000000000000000000000000000',
                    initialStake: BigInt('1000000000000000000000'),
                    minStake: BigInt('1000000000000000000'),
                    maxStake: BigInt('1000000000000000000000'),
                    rewardSplit: BigInt(10), // 10% reward split
                    totalStaked: BigInt('5000000000000000000000'),
                    stakersCount: 25,
                    lockPeriod: BigInt(30 * 24 * 60 * 60),
                    lastRewardClaim: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
                    isActive: true
                },
                {
                    poolId: '0x2345678901234567890123456789012345678901234567890123456789012345',
                    name: 'DeFi Integration Pool',
                    owner: '0x0000000000000000000000000000000000000000',
                    initialStake: BigInt('2000000000000000000000'),
                    minStake: BigInt('500000000000000000'),
                    maxStake: BigInt('5000000000000000000000'),
                    rewardSplit: BigInt(15), // 15% reward split
                    totalStaked: BigInt('8000000000000000000000'),
                    stakersCount: 12,
                    lockPeriod: BigInt(60 * 24 * 60 * 60),
                    lastRewardClaim: BigInt(Math.floor(Date.now() / 1000) - 86400),
                    isActive: true
                }
            ];

            // Calculate admin stats
            const stats: AdminStats = {
                totalPools: mockPools.length,
                totalStaked: mockPools.reduce((acc, pool) => acc + pool.totalStaked, BigInt(0)),
                totalRewards: BigInt('1000000000000000000000')
            };

            setBuilderPools(mockPools);
            setAdminStats(stats);
        } catch (err: any) {
            const contractError = handleContractError(err);
            setError(contractError.message);
        } finally {
            setLoading(false);
        }
    }, [builderContract, treasuryContract, chainId, isClient]);

    useEffect(() => {
        if (isClient) {
            loadBuilderPools();
            // Refresh every 30 seconds
            const interval = setInterval(loadBuilderPools, 30000);
            return () => clearInterval(interval);
        }
    }, [loadBuilderPools, isClient]);

    if (!isClient) {
        return <div className="h-screen flex justify-center items-center">Loading admin panel...</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <ClientOnly fallback={<div className="flex justify-center items-center h-screen">Loading admin panel...</div>}>
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Builder Pool Administration</h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {adminStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-600">Total Pools</h3>
                            <p className="text-3xl font-bold text-blue-600">{adminStats.totalPools}</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-600">Total Staked</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {formatEther(adminStats.totalStaked)} MOR
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-600">Total Rewards</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {formatEther(adminStats.totalRewards)} MOR
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {builderPools.map((pool, index) => (
                        <div key={pool.poolId} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{pool.name}</h3>
                                    <p className="text-sm text-gray-500">Owner: {pool.owner}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        pool.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {pool.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total Staked</p>
                                    <p className="font-semibold">{formatEther(pool.totalStaked)} MOR</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reward Split</p>
                                    <p className="font-semibold">{pool.rewardSplit.toString()}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lock Period</p>
                                    <p className="font-semibold">{Math.floor(Number(pool.lockPeriod) / 86400)} days</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Reward Claim</p>
                                    <p className="font-semibold">
                                        {new Date(Number(pool.lastRewardClaim) * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ClientOnly>
    );
};

export default AdminPanel;
