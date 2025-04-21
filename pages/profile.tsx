import React from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import UserStats from '../components/profile/UserStats';
import { StakingHistory } from '../components/profile/StakingHistory';
import { RewardHistory } from '../components/profile/RewardHistory';
import { NetworkPreferences } from '../components/profile/NetworkPreferences';
import Head from 'next/head';

const ProfilePage = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return (
      <>
        <Head>
          <title>Profile | Morpheus Builder</title>
          <meta name="description" content="View your profile and manage your account on Morpheus Builder" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-dark-bg bg-grid-pattern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 rounded-lg bg-dark-surface shadow-lg backdrop-blur-lg border border-dark-surface/20"
          >
            <h2 className="text-2xl font-bold mb-4 text-dark-onBg">
              Connect Your Wallet
            </h2>
            <p className="text-dark-onBg/70 mb-6">
              Connect your wallet to view your profile and manage your account.
            </p>
            <ConnectButton />
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | Morpheus Builder</title>
        <meta name="description" content="View your profile and manage your account on Morpheus Builder" />
      </Head>
      <div className="min-h-screen bg-dark-bg bg-grid-pattern">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* User Info Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-2 p-6 rounded-lg bg-dark-surface shadow-lg backdrop-blur-lg border border-dark-surface/20"
            >
              <h1 className="text-3xl font-bold mb-2 text-dark-onBg">
                Profile
              </h1>
              <p className="text-dark-onBg/70 break-all">
                {address}
              </p>
            </motion.div>

            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UserStats address={address} />
            </motion.div>

            {/* Network Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NetworkPreferences />
            </motion.div>

            {/* Staking History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-2"
            >
              <StakingHistory address={address} />
            </motion.div>

            {/* Reward History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-2"
            >
              <RewardHistory address={address} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage; 