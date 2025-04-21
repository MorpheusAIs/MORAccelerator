import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { subscribeToNetworkUpdates } from '../../utils/blockchain/networkStats';

interface RepoUpdate {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  html_url: string;
}

interface MRCUpdate {
  id: string;
  title: string;
  status: string;
  created_at: string;
  link: string;
}

interface NetworkStats {
  totalStaked: number;
  activeValidators: number;
  dailyTransactions: number;
  averageBlockTime: number;
  stakingHistory: Array<{
    timestamp: number;
    amount: number;
  }>;
  validatorMetrics: {
    totalBlocks: number;
    avgBlockTime: number;
    totalTransactions: number;
  };
}

const MorpheusAggregator: React.FC = () => {
  const [localNetworkStats, setLocalNetworkStats] = useState<NetworkStats | null>(null);
  // Fetch repository updates
  const { data: repoUpdates, isLoading: repoLoading } = useQuery({
    queryKey: ['repoUpdates'],
    queryFn: async () => {
      const response = await axios.get('https://api.github.com/orgs/MorpheusAIs/repos');
      return response.data.slice(0, 5) as RepoUpdate[];
    },
  });

  // Fetch MRC updates
  const { data: mrcUpdates, isLoading: mrcLoading } = useQuery({
    queryKey: ['mrcUpdates'],
    queryFn: async () => {
      const response = await axios.get('/api/mrcs');
      return response.data as MRCUpdate[];
    },
  });

  // Fetch network stats
  const { data: networkStats, isLoading: statsLoading } = useQuery({
    queryKey: ['networkStats'],
    queryFn: async () => {
      const response = await axios.get('/api/network-stats');
      return response.data as NetworkStats;
    },
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Morpheus Network Overview
      </h2>
      
      {/* Repository Updates */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Latest Repository Updates
        </h3>
        {repoLoading ? (
          <p>Loading repository updates...</p>
        ) : (
          <div className="space-y-4">
            {repoUpdates?.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h4 className="font-medium text-blue-600 dark:text-blue-400">{repo.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{repo.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Updated: {new Date(repo.updated_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* MRC Updates */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Recent MRC Updates
        </h3>
        {mrcLoading ? (
          <p>Loading MRC updates...</p>
        ) : (
          <div className="space-y-4">
            {mrcUpdates?.map((mrc) => (
              <a
                key={mrc.id}
                href={mrc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h4 className="font-medium text-blue-600 dark:text-blue-400">{mrc.title}</h4>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {mrc.status}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Created: {new Date(mrc.created_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Network Statistics */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Network Statistics
        </h3>
        {statsLoading ? (
          <p>Loading network stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Staked</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {networkStats?.totalStaked.toLocaleString()} MOR
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Validators</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {networkStats?.activeValidators}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Transactions</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {networkStats?.dailyTransactions.toLocaleString()}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Block Time</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {networkStats?.averageBlockTime}s
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Quick Links
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="https://morlord.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-center border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            MorLord
          </a>
          <a
            href="https://morstats.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-center border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            MorStats
          </a>
          <a
            href="https://mor.org/ecosystem"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-center border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Ecosystem
          </a>
          <a
            href="https://venice.ai/home"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-center border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Venice AI
          </a>
        </div>
      </div>
    </div>
  );
};

export default MorpheusAggregator;