import React from 'react';
import { motion } from 'framer-motion';
import { useBalance, useChainId } from 'wagmi';
import { formatEther } from 'viem';

interface UserStatsProps {
  address: `0x${string}`;
}

const UserStats: React.FC<UserStatsProps> = ({ address }) => {
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });

  // Mock data for demonstration
  const mockData = {
    totalStaked: BigInt('1000000000000000000'), // 1 ETH
    totalRewards: BigInt('100000000000000000'), // 0.1 ETH
    activePoolCount: 3,
  };

  const getNetworkName = (chainId: number | undefined) => {
    switch (chainId) {
      case 42161:
        return 'Arbitrum One';
      case 8453:
        return 'Base';
      default:
        return 'Not Connected';
    }
  };

  return (
    <div className="p-6 rounded-lg bg-dark-surface shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-dark-onBg">
        Account Overview
      </h2>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center"
        >
          <span className="text-dark-onBg opacity-80">Balance:</span>
          <span className="font-medium text-dark-onBg">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <span className="text-dark-onBg opacity-80">Total Staked:</span>
          <span className="font-medium text-dark-onBg">
            {formatEther(mockData.totalStaked)} ETH
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <span className="text-dark-onBg opacity-80">Total Rewards:</span>
          <span className="font-medium text-dark-onBg">
            {formatEther(mockData.totalRewards)} ETH
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <span className="text-dark-onBg opacity-80">Active Pools:</span>
          <span className="font-medium text-dark-onBg">
            {mockData.activePoolCount}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <span className="text-dark-onBg opacity-80">Network:</span>
          <span className="font-medium text-dark-onBg">
            {getNetworkName(chainId)}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default UserStats; 