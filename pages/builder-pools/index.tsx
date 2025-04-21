import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import ClientOnly from '../../components/common/ClientOnly';
import { useMORToken } from '../../hooks/useMORToken';
import { useBuilderPool } from '../../hooks/useBuilderPool';
import ConnectWalletWrapper from '../../components/ConnectWallet/ConnectWalletWrapper';

const BuilderPools: NextPage = () => {
    const { isConnected, address } = useAccount();
    const { approve, loading: tokenLoading } = useMORToken();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [poolName, setPoolName] = useState('');
    const [poolDescription, setPoolDescription] = useState('');
    const [minStake, setMinStake] = useState('1000');
    
    // Pool data
    const [activePools, setActivePools] = useState<any[]>([]);
    
    // Only load data client-side
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load mock data after client is ready
    useEffect(() => {
        if (isClient) {
            // Set mock data for demonstration
            setActivePools([
                {
                    id: '0x1234567890123456789012345678901234567890123456789012345678901234',
                    name: 'AI Agents Builder Pool',
                    description: 'Collaborative pool for AI agent developers',
                    minStake: '1000',
                    members: 4
                }
            ]);
        }
    }, [isClient]);

    return (
        <>
            <Head>
                <title>Builder Pools | Morpheus Builder</title>
                <meta name="description" content="Explore and join builder pools in the Morpheus ecosystem" />
            </Head>

            <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
                <div className="bg-gradient-glow" />
                
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">
                            <span className="text-gradient">Builder Pools</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Join or create builder pools to collaborate and earn rewards
                        </p>
                    </motion.div>

                    {!isConnected ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glassmorphism p-8 rounded-xl text-center max-w-2xl mx-auto"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-8">
                                Connect your wallet to view and interact with builder pools
                            </p>
                            <div className="flex justify-center">
                                <ConnectWalletWrapper />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glassmorphism p-8 rounded-xl"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Create New Pool</h2>
                                <ClientOnly fallback={<div className="p-4 text-center text-gray-300">Loading form...</div>}>
                                    {isClient && (
                                        <form className="space-y-6" onSubmit={(e) => {
                                            e.preventDefault();
                                            toast.success('Creating pool feature coming soon!');
                                        }}>
                                            <div>
                                                <label htmlFor="poolName" className="block text-sm font-medium text-gray-300">
                                                    Pool Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="poolName"
                                                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                                    placeholder="Enter pool name"
                                                    value={poolName}
                                                    onChange={(e) => setPoolName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="poolDescription" className="block text-sm font-medium text-gray-300">
                                                    Pool Description
                                                </label>
                                                <textarea
                                                    id="poolDescription"
                                                    rows={4}
                                                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                                    placeholder="Describe your builder pool"
                                                    value={poolDescription}
                                                    onChange={(e) => setPoolDescription(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="minStake" className="block text-sm font-medium text-gray-300">
                                                    Minimum Stake (MOR)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="minStake"
                                                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                                    placeholder="Enter minimum stake amount"
                                                    value={minStake}
                                                    onChange={(e) => setMinStake(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow transition-all"
                                                disabled={isLoading || tokenLoading}
                                            >
                                                Create Pool
                                            </button>
                                        </form>
                                    )}
                                </ClientOnly>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glassmorphism p-8 rounded-xl"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Active Pools</h2>
                                <ClientOnly fallback={<div className="p-4 text-center text-gray-300">Loading pools...</div>}>
                                    {isClient && (
                                        <>
                                            {activePools.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {activePools.map((pool) => (
                                                        <div 
                                                            key={pool.id}
                                                            className="glassmorphism p-6 rounded-lg hover-glow transition-all cursor-pointer"
                                                        >
                                                            <h3 className="text-xl font-semibold text-white mb-2">{pool.name}</h3>
                                                            <p className="text-gray-300 mb-4">{pool.description}</p>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-400">Min Stake: {pool.minStake} MOR</span>
                                                                <span className="text-sm text-[#00FF84]">{pool.members} Members</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-gray-300">No active pools found. Create the first one!</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </ClientOnly>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default BuilderPools;
