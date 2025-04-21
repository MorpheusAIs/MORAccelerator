import { useCallback, useMemo, useState } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { STAKING_ABI, STAKING_ADDRESSES } from '../contracts/abis/MorpheusStaking';
import { handleContractError } from '../utils/contractErrors';
import { type StakingContractMethods, type StakingContractWriteMethods } from '../types/contracts';

type StakingContract = GetContractReturnType<typeof STAKING_ABI, PublicClient>;

export function useStakingContract(chainId: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);

    const contract = useMemo((): StakingContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? STAKING_ADDRESSES.arbitrum : STAKING_ADDRESSES.base;

        return getContract({
            address: addresses.builder as Address,
            abi: STAKING_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

    // Write Methods
    const stake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            setIsLoading(true);
            try {
                const { request } = await contract.simulate.stake([poolId, amount]);
                return walletClient.writeContract(request);
            } finally {
                setIsLoading(false);
            }
        },
        [contract, walletClient]
    );

    const unstake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            setIsLoading(true);
            try {
                const { request } = await contract.simulate.unstake([poolId, amount]);
                return walletClient.writeContract(request);
            } finally {
                setIsLoading(false);
            }
        },
        [contract, walletClient]
    );

    const claimRewards = useCallback(
        async (poolId: `0x${string}`): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            setIsLoading(true);
            try {
                const { request } = await contract.simulate.claimRewards([poolId]);
                return walletClient.writeContract(request);
            } finally {
                setIsLoading(false);
            }
        },
        [contract, walletClient]
    );

    // Read Methods
    const getStakerAmount = useCallback(
        async (poolId: `0x${string}`, staker: Address): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getStakerAmount([poolId, staker]);
        },
        [contract]
    );

    const getPendingRewards = useCallback(
        async (poolId: `0x${string}`, staker: Address): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getPendingRewards([poolId, staker]);
        },
        [contract]
    );

    const isLocked = useCallback(
        async (poolId: `0x${string}`, staker: Address): Promise<boolean> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.isLocked([poolId, staker]);
        },
        [contract]
    );

    const getLockEndTime = useCallback(
        async (poolId: `0x${string}`, staker: Address): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getLockEndTime([poolId, staker]);
        },
        [contract]
    );

    const getPoolLimits = useCallback(
        async (poolId: `0x${string}`): Promise<{
            minStake: bigint;
            maxStake: bigint;
            maxParticipants: number;
        }> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getPoolLimits([poolId]);
        },
        [contract]
    );

    const getTotalStaked = useCallback(
        async (): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getTotalStaked();
        },
        [contract]
    );

    const getTotalStakers = useCallback(
        async (): Promise<{ toNumber: () => number }> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getTotalStakers();
        },
        [contract]
    );

    const getAverageLockTime = useCallback(
        async (): Promise<{ toNumber: () => number }> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getAverageLockTime();
        },
        [contract]
    );

    const getStake = useCallback(
        async (address: Address): Promise<{ toString: () => string }> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getStake([address]);
        },
        [contract]
    );

    return {
        contract,
        isLoading,
        // Write methods
        stake,
        unstake,
        claimRewards,
        // Read methods
        getStakerAmount,
        getPendingRewards,
        isLocked,
        getLockEndTime,
        getPoolLimits,
        getTotalStaked,
        getTotalStakers,
        getAverageLockTime,
        getStake
    };
} 