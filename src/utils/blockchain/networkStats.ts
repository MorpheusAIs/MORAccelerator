import { ethers } from 'ethers';
import { createClient } from '@urql/core';
import { NETWORK_CONFIG, SUBGRAPH_ENDPOINTS } from './config';
import { STAKING_ABI, VALIDATOR_REGISTRY_ABI } from './abis';

// Initialize providers
const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.RPC_URLS[0]);
const wsProvider = new ethers.WebSocketProvider(NETWORK_CONFIG.WS_ENDPOINTS.MAINNET);

// Initialize contracts
const stakingContract = new ethers.Contract(
  NETWORK_CONFIG.CONTRACTS.STAKING,
  STAKING_ABI,
  provider
);

const validatorRegistryContract = new ethers.Contract(
  NETWORK_CONFIG.CONTRACTS.VALIDATOR_REGISTRY,
  VALIDATOR_REGISTRY_ABI,
  provider
);

// Initialize GraphQL client for historical data
const subgraphClient = createClient({
  url: SUBGRAPH_ENDPOINTS.MORPHEUS,
});

// Types
export interface NetworkStats {
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

// Function to fetch current network statistics
export async function getCurrentNetworkStats(): Promise<NetworkStats> {
  try {
    // Fetch data from contracts
    const [totalStaked, activeValidators, validatorMetrics] = await Promise.all([
      stakingContract.getTotalStaked(),
      stakingContract.getActiveValidatorsCount(),
      validatorRegistryContract.getValidatorMetrics(),
    ]);

    // Convert BigNumber values to numbers and format appropriately
    return {
      totalStaked: Number(ethers.formatEther(totalStaked)),
      activeValidators: Number(activeValidators),
      dailyTransactions: Number(validatorMetrics.totalTransactions),
      averageBlockTime: Number(validatorMetrics.avgBlockTime) / 1000, // Convert to seconds
      stakingHistory: [], // Will be populated by historical data
      validatorMetrics: {
        totalBlocks: Number(validatorMetrics.totalBlocks),
        avgBlockTime: Number(validatorMetrics.avgBlockTime) / 1000,
        totalTransactions: Number(validatorMetrics.totalTransactions),
      },
    };
  } catch (error) {
    console.error('Error fetching current network stats:', error);
    throw error;
  }
}

// Function to fetch historical staking data
export async function getHistoricalStakingData() {
  const query = `
    query GetStakingHistory($days: Int!) {
      stakingSnapshots(
        first: $days
        orderBy: timestamp
        orderDirection: desc
      ) {
        timestamp
        totalStaked
      }
    }
  `;

  try {
    const { data } = await subgraphClient.query(query, {
      days: NETWORK_CONFIG.HISTORICAL_DAYS,
    }).toPromise();

    return data.stakingSnapshots.map((snapshot: any) => ({
      timestamp: Number(snapshot.timestamp),
      amount: Number(ethers.formatEther(snapshot.totalStaked)),
    }));
  } catch (error) {
    console.error('Error fetching historical staking data:', error);
    throw error;
  }
}

// WebSocket subscription for real-time updates
export function subscribeToNetworkUpdates(callback: (stats: Partial<NetworkStats>) => void) {
  const stakingContract = new ethers.Contract(
    NETWORK_CONFIG.CONTRACTS.STAKING,
    STAKING_ABI,
    wsProvider
  );

  // Listen for staking events
  stakingContract.on('StakeChanged', async () => {
    try {
      const totalStaked = await stakingContract.getTotalStaked();
      callback({
        totalStaked: Number(ethers.formatEther(totalStaked)),
      });
    } catch (error) {
      console.error('Error handling StakeChanged event:', error);
    }
  });

  // Listen for validator changes
  stakingContract.on('ValidatorStatusChanged', async () => {
    try {
      const activeValidators = await stakingContract.getActiveValidatorsCount();
      callback({
        activeValidators: Number(activeValidators),
      });
    } catch (error) {
      console.error('Error handling ValidatorStatusChanged event:', error);
    }
  });

  return () => {
    stakingContract.removeAllListeners();
  };
}