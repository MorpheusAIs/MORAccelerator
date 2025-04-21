import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-hot-toast';
import ClientOnly from '../components/common/ClientOnly';
import { useMORToken } from '../hooks/useMORToken';

const Register: NextPage = () => {
  const { isConnected, address } = useAccount();
  const { formattedBalance, approve, loading: tokenLoading } = useMORToken();
  
  // Form state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [initialStake, setInitialStake] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock registration process
      toast.success('Registration feature coming soon!');
      console.log('Registration data:', {
        projectName,
        projectDescription,
        initialStake,
        wallet: address
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register as Builder | Morpheus Builder</title>
        <meta name="description" content="Join the Morpheus Builder ecosystem and start building Smart Agents" />
      </Head>

      <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
        <div className="bg-gradient-glow" />
        
        <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Become a <span className="text-gradient">Morpheus Builder</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our ecosystem and start building the next generation of Smart Agents
            </p>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism p-8 rounded-xl text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8">
                Connect your wallet to register as a Morpheus Builder
              </p>
              <ConnectButton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism p-8 rounded-xl"
            >
              <ClientOnly fallback={<div className="text-gray-300">Loading registration form...</div>}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Enter your project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Describe your Smart Agent project"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="initialStake" className="block text-sm font-medium text-gray-300">
                    Initial Stake (MOR)
                  </label>
                  <input
                    type="number"
                    id="initialStake"
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Enter initial stake amount"
                    value={initialStake}
                    onChange={(e) => setInitialStake(e.target.value)}
                    min="100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow transition-all"
                  disabled={isLoading || tokenLoading}
                >
                  Register Project
                </button>
                </form>
                
                {formattedBalance && (
                  <div className="mt-4 text-sm text-gray-300">
                    Your MOR Balance: {formattedBalance} MOR
                  </div>
                )}
              </ClientOnly>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Register;
