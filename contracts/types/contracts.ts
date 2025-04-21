import { type Address } from 'viem';

export interface BuilderPool {
    name: string;
    owner: Address;
    totalStaked: bigint;
    rewardSplit: bigint;
    lockPeriod: bigint;
    lastRewardClaim: bigint;
    isActive: boolean;
}

export interface DistributionInterval {
    startTime: bigint;
    endTime: bigint;
    amount: bigint;
}

export interface NetworkContract {
    address: Address;
    abi: any[];
}

export interface NetworkAddresses {
    builder: Address;
    builderAbi: string;
    treasury: Address;
    feeConfig: Address;
}

export interface ContractAddresses {
    arbitrum: NetworkAddresses;
    base: NetworkAddresses;
}

export interface StakingInfo {
    amount: bigint;
    lockEndTime: bigint;
    pendingRewards: bigint;
}

export interface BuilderPoolCreationParams {
    name: string;
    initialStake: bigint;
    lockPeriod: number;
    rewardSplit: number;
} 