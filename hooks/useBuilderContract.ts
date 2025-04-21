import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { BUILDER_ABI, BUILDER_ADDRESSES } from '../contracts/abis/MorpheusBuilder';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { BuilderPool, BuilderPoolCreationParams, StakingInfo } from '../contracts/types/contracts';

type BuilderContract = GetContractReturnType<typeof BUILDER_ABI, PublicClient>;

export function useBuilderContract(providedChainId?: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const wagmiChainId = useChainId();
    
    // Use the provided chainId or fallback to the connected chain
    const chainId = providedChainId || wagmiChainId;

    const contract = useMemo((): BuilderContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? BUILDER_ADDRESSES.arbitrum : BUILDER_ADDRESSES.base;

        return getContract({
            address: addresses.builder as Address,
            abi: BUILDER_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

    const createBuilderPool = useCallback(
        async (params: BuilderPoolCreationParams): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.createBuilderPool([
                params.name,
                params.initialStake,
                BigInt(params.lockPeriod),
                BigInt(params.rewardSplit)
            ]);
            
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const stake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.stake([poolId, amount]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const unstake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.unstake([poolId, amount]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const claimRewards = useCallback(
        async (poolId: `0x${string}`): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.claimRewards([poolId]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const getBuilderPool = useCallback(
        async (poolId: `0x${string}`): Promise<BuilderPool> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getBuilderPool([poolId]);
        },
        [contract]
    );

    const getStakingInfo = useCallback(
        async (poolId: `0x${string}`, address: Address): Promise<StakingInfo> => {
            if (!contract) throw new Error('Contract not initialized');
            
            const [amount, isLocked, lockEndTime, pendingRewards] = await Promise.all([
                contract.read.getStakerAmount([poolId, address]),
                contract.read.isLocked([poolId, address]),
                contract.read.getLockEndTime([poolId, address]),
                contract.read.getPendingRewards([poolId, address])
            ]);
            
            return {
                amount,
                lockEndTime,
                pendingRewards
            };
        },
        [contract]
    );

    // Mock implementation for testing/demo purposes
    const getTotalDistributedRewards = useCallback(
        async (): Promise<bigint> => {
            return BigInt('1000000000000000000000'); // 1000 tokens in wei
        },
        []
    );

    const getTotalPendingRewards = useCallback(
        async (): Promise<bigint> => {
            return BigInt('500000000000000000000'); // 500 tokens in wei
        },
        []
    );

    const getUserClaimedRewards = useCallback(
        async (userAddress: Address): Promise<bigint> => {
            return BigInt('100000000000000000000'); // 100 tokens in wei
        },
        []
    );

    const queryFilter = useCallback(
        async (filter: any, blockRange: number) => {
            // Mock implementation that returns recent claims
            return [{
                args: {
                    amount: BigInt('50000000000000000000'), // 50 tokens
                    timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400),
                },
                transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
            }];
        },
        []
    );

    // Mock for filters object
    const filters = {
        RewardsClaimed: (address: Address) => ({ address })
    };

    return {
        contract: {
            ...contract,
            address: contract?.address || ('0x0000000000000000000000000000000000000000' as Address),
            abi: BUILDER_ABI,
            read: {
                getStakerAmount: async ([poolId, address]: readonly [`0x${string}`, Address]) => BigInt('1000000000000000000000'),
                getPendingRewards: async ([poolId, address]: readonly [`0x${string}`, Address]) => BigInt('50000000000000000000'),
                isLocked: async ([poolId, address]: readonly [`0x${string}`, Address]) => false,
                getLockEndTime: async ([poolId, address]: readonly [`0x${string}`, Address]) => BigInt(0),
                getPoolLimits: async ([poolId]: readonly [`0x${string}`]) => ({
                    minStake: BigInt('1000000000000000000'),
                    maxStake: BigInt('1000000000000000000000'),
                    maxParticipants: 100
                }),
                getTotalStaked: async () => BigInt('5000000000000000000000'),
                getTotalStakers: async () => ({ toNumber: () => 25 }),
                getAverageLockTime: async () => ({ toNumber: () => 30 * 24 * 60 * 60 }),
                getStake: async (address: Address) => ({ toString: () => '1000000000000000000000' }),
                getBuilderPool: async ([poolId]: readonly [`0x${string}`]) => ({
                    id: poolId,
                    name: 'Mock Builder Pool',
                    owner: '0x0000000000000000000000000000000000000000' as Address,
                    initialStake: BigInt('1000000000000000000000'),
                    minStake: BigInt('1000000000000000000'),
                    maxStake: BigInt('1000000000000000000000'),
                    rewardRate: BigInt('100'),
                    totalStaked: BigInt('5000000000000000000000'),
                    stakersCount: 25,
                    lockPeriod: 30 * 24 * 60 * 60,
                    isActive: true
                })
            },
            write: {
                stake: async ([poolId, amount]: readonly [`0x${string}`, bigint]) => '0x' as Hash,
                unstake: async ([poolId, amount]: readonly [`0x${string}`, bigint]) => '0x' as Hash,
                claimRewards: async ([poolId]: readonly [`0x${string}`]) => '0x' as Hash
            },
            estimateGas: { createBuilderPool, stake, unstake, claimRewards }
        },
        createBuilderPool,
        stake,
        unstake,
        claimRewards,
        getBuilderPool,
        getStakingInfo,
        // Mock methods for rewards page
        getTotalDistributedRewards,
        getTotalPendingRewards,
        getUserClaimedRewards,
        queryFilter,
        filters
    };
}
