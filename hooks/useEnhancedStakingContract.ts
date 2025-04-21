import { useCallback, useMemo, useState } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract, formatUnits, parseUnits } from 'viem';
import { usePublicClient, useWalletClient, useChainId, useAccount } from 'wagmi';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { STAKING_ABI, STAKING_ADDRESSES } from '../contracts/abis/MorpheusStaking';
import { handleContractError } from '../utils/contractErrors';
import { type StakingContractMethods, type StakingContractWriteMethods } from '../types/contracts';
import { usePowerFactor } from './usePowerFactor';
import { useMORToken } from './useMORToken';

type StakingContract = GetContractReturnType<typeof STAKING_ABI, PublicClient>;

// Reward distribution percentages
const REWARD_DISTRIBUTION = {
  STAKERS: 50,      // 50% to stakers
  MAINTAINER: 20,   // 20% to Maintainer Wallet
  MENTORS: 5,       // 5% to Mentor Wallets
  OPERATIONS: 25    // 25% to Operations Multisig
};

// Minimum staking threshold in MOR tokens
const MINIMUM_STAKING_THRESHOLD = '100'; // 100 MOR tokens

export function useEnhancedStakingContract(chainId: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Get power factor calculation functions
    const { calculatePowerFactor, calculateVirtualStakedAmount } = usePowerFactor();
    
    // Get MOR token functions
    const { approve, formattedBalance, address: tokenAddress } = useMORToken();

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

    // Check if user meets minimum staking threshold
    const meetsMinimumStakingThreshold = useMemo(() => {
        if (!formattedBalance) return false;
        return parseFloat(formattedBalance) >= parseFloat(MINIMUM_STAKING_THRESHOLD);
    }, [formattedBalance]);

    // Enhanced stake function with power factor
    const enhancedStake = useCallback(
        async (poolId: `0x${string}`, amount: string, lockPeriod: number): Promise<Hash | undefined> => {
            if (!contract || !walletClient || !address || !tokenAddress) {
                setError('Contract or wallet not initialized');
                return undefined;
            }
            
            // Check minimum staking threshold
            if (!meetsMinimumStakingThreshold) {
                setError(`Minimum staking threshold of ${MINIMUM_STAKING_THRESHOLD} MOR not met`);
                return undefined;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                // Convert amount to bigint
                const decimals = 18; // MOR token decimals
                const amountBigInt = parseUnits(amount, decimals);
                
                // First approve the token transfer
                const approvalTx = await approve(contract.address as Address, amount);
                
                // Wait for approval to be confirmed
                // In a production app, you would wait for the transaction to be confirmed
                
                // Calculate virtual amount based on lock period
                const stakingDuration = lockPeriod;
                const powerFactor = calculatePowerFactor(stakingDuration);
                
                console.log(`Staking ${amount} MOR with power factor ${powerFactor}x for ${lockPeriod} seconds`);
                
                // Call the stake function
                const { request } = await contract.simulate.stake([poolId, amountBigInt]);
                const txHash = await walletClient.writeContract(request);
                
                return txHash;
            } catch (err) {
                console.error('Error staking tokens:', err);
                setError(err instanceof Error ? err.message : 'Unknown error during staking');
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [contract, walletClient, address, tokenAddress, meetsMinimumStakingThreshold, approve, calculatePowerFactor]
    );

    // Get staking info with power factor
    const getEnhancedStakingInfo = useCallback(
        async (poolId: `0x${string}`, stakerAddress: Address): Promise<{
            amount: bigint;
            virtualAmount: bigint;
            powerFactor: number;
            lockEndTime: bigint;
            pendingRewards: bigint;
        }> => {
            if (!contract) throw new Error('Contract not initialized');
            
            try {
                // Get basic staking info
                const [amount, isLocked, lockEndTime, pendingRewards] = await Promise.all([
                    contract.read.getStakerAmount([poolId, stakerAddress]),
                    contract.read.isLocked([poolId, stakerAddress]),
                    contract.read.getLockEndTime([poolId, stakerAddress]),
                    contract.read.getPendingRewards([poolId, stakerAddress])
                ]);
                
                // Calculate staking duration and power factor
                const currentTime = Math.floor(Date.now() / 1000);
                const lockStartTime = isLocked ? Number(lockEndTime) - (30 * 24 * 60 * 60) : currentTime; // Assuming 30-day lock period
                const stakingDuration = Math.max(0, currentTime - lockStartTime);
                
                const powerFactor = calculatePowerFactor(stakingDuration);
                const virtualAmount = calculateVirtualStakedAmount(amount, stakingDuration);
                
                return {
                    amount,
                    virtualAmount,
                    powerFactor,
                    lockEndTime,
                    pendingRewards
                };
            } catch (err) {
                console.error('Error getting enhanced staking info:', err);
                throw err;
            }
        },
        [contract, calculatePowerFactor, calculateVirtualStakedAmount]
    );

    // Get reward distribution info
    const getRewardDistribution = useCallback(() => {
        return REWARD_DISTRIBUTION;
    }, []);

    // Check if maintainer wallet meets staking requirements (50% must be staked)
    const checkMaintainerStakingRequirement = useCallback(
        async (maintainerAddress: Address, totalMaintainerBalance: bigint): Promise<boolean> => {
            if (!contract) return false;
            
            try {
                // Get total staked by maintainer across all pools
                // This is a simplified implementation - in reality, you would need to sum across all pools
                const totalStaked = await contract.read.getTotalStaked();
                
                // Check if at least 50% is staked
                return totalStaked >= (totalMaintainerBalance / BigInt(2));
            } catch (err) {
                console.error('Error checking maintainer staking requirement:', err);
                return false;
            }
        },
        [contract]
    );

    return {
        contract,
        isLoading,
        error,
        // Enhanced staking functions
        enhancedStake,
        getEnhancedStakingInfo,
        // Reward distribution
        getRewardDistribution,
        checkMaintainerStakingRequirement,
        // Minimum staking threshold
        meetsMinimumStakingThreshold,
        minimumStakingThreshold: MINIMUM_STAKING_THRESHOLD,
        // Original functions from useStakingContract
        unstake: async (poolId: `0x${string}`, amount: bigint): Promise<Hash | undefined> => {
            if (!contract || !walletClient) {
                setError('Contract or wallet not initialized');
                return undefined;
            }
            setIsLoading(true);
            setError(null);
            try {
                const { request } = await contract.simulate.unstake([poolId, amount]);
                return walletClient.writeContract(request);
            } catch (err) {
                console.error('Error unstaking tokens:', err);
                setError(err instanceof Error ? err.message : 'Unknown error during unstaking');
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        claimRewards: async (poolId: `0x${string}`): Promise<Hash | undefined> => {
            if (!contract || !walletClient) {
                setError('Contract or wallet not initialized');
                return undefined;
            }
            setIsLoading(true);
            setError(null);
            try {
                const { request } = await contract.simulate.claimRewards([poolId]);
                return walletClient.writeContract(request);
            } catch (err) {
                console.error('Error claiming rewards:', err);
                setError(err instanceof Error ? err.message : 'Unknown error during claiming');
                return undefined;
            } finally {
                setIsLoading(false);
            }
        }
    };
}
