import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import MainLayout from '../components/layout/MainLayout';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import LoadingState from '../components/common/LoadingState';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useEffect, useState } from 'react';

interface AdminStats {
    totalPools: number;
    totalStaked: string;
    totalRewardsDistributed: string;
    activePools: number;
}

const Admin: NextPage = () => {
    const { address, isConnected } = useAccount();
    const { contract, isAdmin } = useBuilderContract();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            if (!contract || !isConnected || !isAdmin) {
                setLoading(false);
                return;
            }
            
            try {
                const [
                    poolCount,
                    totalStaked,
                    totalRewards,
                    pools
                ] = await Promise.all([
                    contract.getPoolCount(),
                    contract.getTotalStaked(),
                    contract.getTotalDistributedRewards(),
                    contract.getAllPools()
                ]);

                const activePools = pools.filter(pool => pool.isActive).length;

                setStats({
                    totalPools: poolCount.toNumber(),
                    totalStaked: totalStaked.toString(),
                    totalRewardsDistributed: totalRewards.toString(),
                    activePools
                });
            } catch (error) {
                console.error('Error loading admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [contract, isConnected, isAdmin]);

    if (loading) {
        return (
            <MainLayout>
                <LoadingState message="Loading admin information..." />
            </MainLayout>
        );
    }

    if (!isConnected) {
        return (
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600">Connect your wallet to access admin functions</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!isAdmin) {
        return (
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600">You do not have admin access</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Admin | Morpheus Builder</title>
                <meta name="description" content="Admin functions for Morpheus Builder" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="mt-2 text-gray-600">Manage builder pools and platform settings</p>
                </div>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Pools</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalPools}</p>
                            <p className="mt-2 text-sm text-gray-500">{stats.activePools} Active</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Staked</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalStaked} MOR</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Rewards Distributed</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalRewardsDistributed} MOR</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md">
                    <AdminPanel />
                </div>
            </div>
        </MainLayout>
    );
};

export default Admin; 