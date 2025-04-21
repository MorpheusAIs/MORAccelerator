import { type Address, type Hash } from 'viem';

export interface StakingPool {
  id: `0x${string}`;
  name: string;
  owner: Address;
  token: Address;
  minStake: bigint;
  maxStake: bigint;
  maxParticipants: number;
  totalStaked: bigint;
  rewardRate: bigint;
  lockPeriod: number;
  isActive: boolean;
}

export interface PoolData {
  id: `0x${string}`;
  name: string;
  owner: Address;
  token: Address;
  maxParticipants: number;
  minStake?: bigint;
  maxStake?: bigint;
  totalStaked?: bigint;
  rewardRate?: bigint;
  lockPeriod?: number;
  isActive?: boolean;
}

export interface StakingContractMethods {
  getStakerAmount: (args: readonly [`0x${string}`, Address], options?: any) => Promise<bigint>;
  getPendingRewards: (args: readonly [`0x${string}`, Address], options?: any) => Promise<bigint>;
  isLocked: (args: readonly [`0x${string}`, Address], options?: any) => Promise<boolean>;
  getLockEndTime: (args: readonly [`0x${string}`, Address], options?: any) => Promise<bigint>;
  getPoolLimits: (args: readonly [`0x${string}`], options?: any) => Promise<{
    minStake: bigint;
    maxStake: bigint;
    maxParticipants: number;
  }>;
  getTotalStaked: (options?: any) => Promise<bigint>;
  getTotalStakers: (options?: any) => Promise<{ toNumber: () => number }>;
  getAverageLockTime: (options?: any) => Promise<{ toNumber: () => number }>;
  getStake: (address: Address, options?: any) => Promise<{ toString: () => string }>;
}

export interface StakingContractWriteMethods {
  stake: (args: readonly [`0x${string}`, bigint], options?: any) => Promise<Hash>;
  unstake: (args: readonly [`0x${string}`, bigint], options?: any) => Promise<Hash>;
  claimRewards: (args: readonly [`0x${string}`], options?: any) => Promise<Hash>;
}

export interface StakingContract {
  contract: {
    address: Address;
    abi: any[];
    read: StakingContractMethods;
    write: StakingContractWriteMethods;
  };
  isLoading?: boolean;
}

export interface StakingFormData {
  amount: string;
  poolId: string;
  lockPeriod?: number;
}

export interface StakingStats {
  totalStaked: bigint;
  rewardSplit: number;
  lockPeriod: number;
  pendingRewards: bigint;
  isLocked: boolean;
  lockEndTime: number;
  minStake: bigint;
  maxStake: bigint;
}

export interface StakingError {
  type: 'validation' | 'transaction' | 'contract';
  message: string;
  details?: unknown;
}
