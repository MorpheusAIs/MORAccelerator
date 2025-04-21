import React from 'react';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import { StakingPool } from '../../types/contracts';

interface PoolMetricsProps {
  pool: StakingPool;
  participantCount: number;
}

const MetricCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-dark-surface p-4 rounded-lg shadow-lg border border-dark-surface/20">
    <h3 className="text-sm font-medium text-dark-onBg/70">{title}</h3>
    <p className="mt-2 text-lg font-semibold text-dark-onBg">{value}</p>
  </div>
);

export const PoolMetrics: React.FC<PoolMetricsProps> = ({ pool, participantCount }) => {
  const metrics = [
    {
      title: 'Total Staked',
      value: `${formatEther(pool.totalStaked)} MOR`
    },
    {
      title: 'Reward Split',
      value: `${Number(pool.rewardSplit) / 100}%`
    },
    {
      title: 'Lock Period',
      value: `${Number(pool.lockPeriod) / 86400} days`
    },
    {
      title: 'Participants',
      value: participantCount
    },
    {
      title: 'Average Stake',
      value: participantCount > 0
        ? `${formatEther(pool.totalStaked / BigInt(participantCount))} MOR`
        : '0 MOR'
    },
    {
      title: 'Status',
      value: pool.isActive ? 'Active' : 'Inactive'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-dark-onBg">
        Pool Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard title={metric.title} value={metric.value} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PoolMetrics; 