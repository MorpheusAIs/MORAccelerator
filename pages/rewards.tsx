import { type NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { type Address, formatEther } from 'viem';
import MainLayout from '../components/layout/MainLayout';
import { RewardsTracker } from '../components/RewardsTracker';
import LoadingState from '../components/common/LoadingState';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useStakingContract } from '../hooks/useStakingContract';
import { useMORToken } from '../hooks/useMORToken';
import { useEffect, useState } from 'react';
import ClientOnly from '../components/common/ClientOnly';
import { toast } from 'react-hot-toast';
import ImprovedConnectWallet from '../components/ConnectWallet/ImprovedConnectWallet';

interface RewardsStats {
    totalDistributed: string;
    totalPending: string;
    yourTotalClaimed: string;
    yourPendingRewards: string;
    recentClaims: {
        amount: string;
        timestamp: number;
        txHash: string;
    }[];
}

const Rewards: NextPage = () => {
    const { address, isConnected } = useAccount();
    const { contract: builderContract } = useBuilderContract();
    const { contract: stakingContract } = useStakingContract();
    const { formattedBalance, loading: tokenLoading } = useMORToken();
    const [stats, setStats] = useState<RewardsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    
    // Fix hydration issues - only render on client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Mock data for demonstration
    useEffect(() => {
        if (isClient && isConnected) {
            // Simulate loading data
            const timer = setTimeout(() => {
                setStats({
                    totalDistributed: '1000000000000000000000',  // 1000 MOR
                    totalPending: '500000000000000000000',       // 500 MOR
                    yourTotalClaimed: '100000000000000000000',   // 100 MOR
                    yourPendingRewards: '50000000000000000000',  // 50 MOR
                    recentClaims: [
                        {
                            amount: '50000000000000000000',
                            timestamp: Date.now() - 86400000, // Yesterday
                            txHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
                        }
                    ]
                });
                setLoading(false);
            }, 1000);
            
            return () => clearTimeout(timer);
        } else if (isClient) {
            setLoading(false);
        }
    }, [isClient, isConnected]);

    if (loading || tokenLoading || !isClient) {
        return (
            <MainLayout>
                <LoadingState message="Loading rewards information..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Rewards | MOR Protocol</title>
                <meta name="description" content="Track and claim your rewards in the MOR Protocol" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Rewards Dashboard</h1>
                <ClientOnly fallback={<div className="text-center py-6">Loading rewards data...</div>}>
                    {!isConnected ? (
                        <div className="glassmorphism p-8 rounded-xl text-center max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-8">
                                Connect your wallet to view and claim your rewards
                            </p>
                            <div className="flex justify-center">
                                <ImprovedConnectWallet />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* MOR Balance Card */}
                            {formattedBalance && (
                                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
                                    <h2 className="text-xl font-semibold mb-4">Your MOR Balance</h2>
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Available Balance</p>
                                            <p className="text-2xl font-bold">{formattedBalance} MOR</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <RewardsTracker />
                            
                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-700">Total Rewards Distributed</h3>
                                        <p className="mt-2 text-3xl font-bold text-indigo-600">
                                            {formatEther(BigInt(stats.totalDistributed || '0'))} MOR
                                        </p>
                                    </div>
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-700">Total Pending Rewards</h3>
                                        <p className="mt-2 text-3xl font-bold text-green-600">
                                            {formatEther(BigInt(stats.totalPending || '0'))} MOR
                                        </p>
                                    </div>
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-700">Your Total Claimed</h3>
                                        <p className="mt-2 text-3xl font-bold text-blue-600">
                                            {formatEther(BigInt(stats.yourTotalClaimed || '0'))} MOR
                                        </p>
                                    </div>
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-700">Your Pending Rewards</h3>
                                        <p className="mt-2 text-3xl font-bold text-yellow-600">
                                            {formatEther(BigInt(stats.yourPendingRewards || '0'))} MOR
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </ClientOnly>
            </div>
        </MainLayout>
    );
};

export default Rewards;
