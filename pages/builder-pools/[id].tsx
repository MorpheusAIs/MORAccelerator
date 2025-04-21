import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { BuilderPool } from '../../contracts/types/contracts';
import LoadingState from '../../components/common/LoadingState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { toast } from 'react-hot-toast';

interface PoolParticipant {
  address: string;
  stakedAmount: bigint;
  lockEndTime: number;
  pendingRewards: bigint;
}

const PoolDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { contract, getPool, getStakerAmount, getPendingRewards, getLockEndTime } = useBuilderContract(chainId);
  
  const [pool, setPool] = useState<BuilderPool | null>(null);
  const [participants, setParticipants] = useState<PoolParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !contract) return;

    const loadPoolData = async () => {
      try {
        setIsLoading(true);
        const poolData = await getPool(id as `0x${string}`);
        setPool(poolData);

        // TODO: Implement participant list fetching
        // This will require event filtering and processing
        const mockParticipants: PoolParticipant[] = [];
        setParticipants(mockParticipants);
      } catch (err) {
        console.error('Failed to load pool data:', err);
        setError('Failed to load pool data. Please try again.');
        toast.error('Failed to load pool data');
      } finally {
        setIsLoading(false);
      }
    };

    loadPoolData();
  }, [id, contract, getPool]);

  if (isLoading) return <LoadingState message="Loading pool details..." />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!pool) return <div>Pool not found</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Pool Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {pool.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Staked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatEther(pool.totalStaked)} MOR
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reward Split</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Number(pool.rewardSplit) / 100}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lock Period</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Number(pool.lockPeriod) / 86400} days
                </p>
              </div>
            </div>
          </div>

          {/* Pool Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pool Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {participants.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Stake</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {participants.length > 0
                    ? formatEther(pool.totalStaked / BigInt(participants.length))
                    : '0'} MOR
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pool.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Reward Claim</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date(Number(pool.lastRewardClaim) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Participant List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Participants
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Staked Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lock End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pending Rewards
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {participants.map((participant, index) => (
                    <tr key={participant.address}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {participant.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatEther(participant.stakedAmount)} MOR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(participant.lockEndTime * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatEther(participant.pendingRewards)} MOR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default PoolDetailPage; 