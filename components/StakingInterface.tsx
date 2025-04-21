import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId, usePublicClient, useBalance, useContractRead } from 'wagmi';
import { type Address, formatEther, parseEther } from 'viem';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBuilderPool } from '../hooks/useBuilderPool';
import { useStakingContract } from '../hooks/useStakingContract';
import { useMORToken } from '../hooks/useMORToken';
import { handleContractError } from '../utils/contractErrors';
import { toast } from 'react-hot-toast';
import ClientOnly from './common/ClientOnly';
import { GasEstimator } from './staking/GasEstimator';
import { LockPeriodSelector } from './staking/LockPeriodSelector';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';
import { StakingPool, StakingContract, StakingStats, StakingFormData, StakingError } from '../types/contracts';

// Enhanced validation schema with better error messages
const stakingFormSchema = z.object({
    amount: z.string()
        .min(1, 'Amount is required')
        .refine(val => !isNaN(Number(val)), 'Amount must be a valid number')
        .refine(val => Number(val) > 0, 'Amount must be greater than 0')
        .refine(val => {
            const decimals = val.split('.')[1]?.length || 0;
            return decimals <= 18;
        }, 'Maximum 18 decimal places allowed')
        .refine(val => {
            try {
                parseEther(val);
                return true;
            } catch {
                return false;
            }
        }, 'Invalid amount format'),
    poolId: z.string()
        .min(1, 'Pool selection is required')
        .refine(val => val.startsWith('0x'), 'Invalid pool ID format')
});

export function StakingInterface() {
    const chainId = useChainId();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { approve, allowance, formattedAllowance, loading: tokenLoading } = useMORToken();
    const [selectedPool, setSelectedPool] = useState<`0x${string}` | null>(null);
    const [stats, setStats] = useState<StakingStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [needsApproval, setNeedsApproval] = useState(false);
    const [approving, setApproving] = useState(false);
    const [availablePools, setAvailablePools] = useState<StakingPool[]>([]);
    const [selectedLockPeriod, setSelectedLockPeriod] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<StakingError | null>(null);

    const { data: balance } = useBalance({
        address: address as Address,
    });

    const { getPools } = useBuilderPool();
    const stakingContract = useStakingContract(chainId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError: setFormError,
        clearErrors
    } = useForm<StakingFormData>({
        resolver: zodResolver(stakingFormSchema),
        mode: 'onChange'
    });

    const watchAmount = watch('amount');
    const watchPoolId = watch('poolId');

    // Load available pools with error handling
    useEffect(() => {
        const loadPools = async () => {
            try {
                setIsLoading(true);
                const pools = await getPools();
                // Map the pool data to include required fields
                // Use the poolData type and extend with required fields
                const mappedPools = pools.map(pool => ({
                    ...pool,
                    owner: pool.owner || ('0x0000000000000000000000000000000000000000' as Address),
                    token: pool.token || ('0x0000000000000000000000000000000000000000' as Address),
                    maxParticipants: pool.maxParticipants || 0,
                    rewardRate: BigInt(0),
                    lockPeriod: 0,
                    isActive: true
                })) as StakingPool[];
                setAvailablePools(mappedPools);
            } catch (error) {
                console.error('Failed to load pools:', error);
                setError({
                    type: 'contract',
                    message: 'Failed to load available pools',
                    details: error
                });
                toast.error('Failed to load available pools');
            } finally {
                setIsLoading(false);
            }
        };

        if (isConnected) {
            loadPools();
        }
    }, [getPools, isConnected]);

    // Load pool stats with enhanced error handling
    const loadStats = useCallback(async () => {
        if (!selectedPool || !address || !stakingContract?.contract) return;

        try {
            setIsLoading(true);
            clearErrors();

            const [stakedAmount, locked, lockEnd, rewards, limits] = await Promise.all([
                stakingContract.contract.read.getStakerAmount([selectedPool, address as Address]),
                stakingContract.contract.read.isLocked([selectedPool, address as Address]),
                stakingContract.contract.read.getLockEndTime([selectedPool, address as Address]),
                stakingContract.contract.read.getPendingRewards([selectedPool, address as Address]),
                stakingContract.contract.read.getPoolLimits([selectedPool])
            ]);

            setStats({
                totalStaked: stakedAmount,
                rewardSplit: 0,
                lockPeriod: selectedLockPeriod,
                pendingRewards: rewards,
                isLocked: locked,
                lockEndTime: Number(lockEnd),
                minStake: limits.minStake,
                maxStake: limits.maxStake
            });
        } catch (error) {
            console.error('Failed to load staking stats:', error);
            setError({
                type: 'contract',
                message: 'Failed to load staking stats',
                details: error
            });
            toast.error('Failed to load staking stats');
        } finally {
            setIsLoading(false);
        }
    }, [selectedPool, address, stakingContract, selectedLockPeriod, clearErrors]);

    // Enhanced amount validation
    useEffect(() => {
        if (!watchAmount || !stats || !balance) return;

        try {
            const amount = parseEther(watchAmount);
            
            if (amount > balance.value) {
                setFormError('amount', {
                    type: 'validation',
                    message: 'Amount exceeds your balance'
                });
                return;
            }

            if (amount < stats.minStake) {
                setFormError('amount', {
                    type: 'validation',
                    message: `Minimum stake is ${formatEther(stats.minStake)} MOR`
                });
                return;
            }

            if (amount > stats.maxStake) {
                setFormError('amount', {
                    type: 'validation',
                    message: `Maximum stake is ${formatEther(stats.maxStake)} MOR`
                });
                return;
            }

            clearErrors('amount');
        } catch (error) {
            setFormError('amount', {
                type: 'validation',
                message: 'Invalid amount format'
            });
        }
    }, [watchAmount, stats, balance, setFormError, clearErrors]);

    // Pool selection handling
    useEffect(() => {
        if (watchPoolId) {
            setSelectedPool(watchPoolId as `0x${string}`);
        }
    }, [watchPoolId]);

    // Stats loading on pool selection
    useEffect(() => {
        if (selectedPool) {
            loadStats();
        }
    }, [selectedPool, loadStats]);

    // Check if token approval is needed
    useEffect(() => {
        if (!selectedPool || !address || !watchAmount || !allowance) return;
        
        try {
            const amount = parseEther(watchAmount || '0');
            if (BigInt(allowance) < amount) {
                setNeedsApproval(true);
            } else {
                setNeedsApproval(false);
            }
        } catch (error) {
            console.error('Error checking allowance:', error);
        }
    }, [selectedPool, address, watchAmount, allowance]);
    
    // Handle token approval
    const handleApprove = async () => {
        if (!selectedPool || !stakingContract?.contract || !watchAmount) return;
        
        setApproving(true);
        try {
            await approve(stakingContract.contract.address as Address, watchAmount);
            toast.success('Token approval successful');
            setNeedsApproval(false);
        } catch (error) {
            console.error('Error approving tokens:', error);
            toast.error('Failed to approve tokens');
        } finally {
            setApproving(false);
        }
    };

    // Enhanced form submission with proper error handling
    const onSubmit = useCallback(async (data: StakingFormData) => {
        if (!address || !publicClient || !stats || !stakingContract?.contract) return;
        
        // Check approval first
        if (needsApproval) {
            toast.error('Please approve token spending first');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        clearErrors();

        try {
            const amount = parseEther(data.amount);

            // Final validation
            if (amount > balance!.value) {
                throw new Error('Insufficient balance');
            }
            if (amount < stats.minStake || amount > stats.maxStake) {
                throw new Error('Amount outside pool limits');
            }

            const hash = await stakingContract.contract.write.stake([data.poolId as `0x${string}`, amount]);
            
            toast.success('Staking transaction submitted');
            await publicClient.waitForTransactionReceipt({ hash });
            await loadStats();
            
            reset();
            toast.success('Successfully staked tokens');
        } catch (err) {
            const contractError = handleContractError(err);
            setError({
                type: 'transaction',
                message: contractError.message,
                details: err
            });
            
            if (contractError.type === 'INSUFFICIENT_BALANCE') {
                setFormError('amount', { 
                    type: 'validation',
                    message: 'Insufficient balance'
                });
            }
            console.error('Failed to stake:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [address, publicClient, stats, balance, stakingContract, loadStats, reset, setFormError, clearErrors]);

    // Enhanced unstake handling
    const handleUnstake = async (amount: string) => {
        if (!address || !selectedPool || !publicClient || !stats || !stakingContract?.contract) return;

        try {
            setIsLoading(true);
            clearErrors();
            
            if (stats.isLocked) {
                throw new Error('Tokens are still locked');
            }

            const unstakeAmount = parseEther(amount);
            if (unstakeAmount > stats.totalStaked) {
                throw new Error('Unstake amount exceeds staked balance');
            }

            const hash = await stakingContract.contract.write.unstake([selectedPool, unstakeAmount]);
            
            toast.success('Unstaking transaction submitted');
            await publicClient.waitForTransactionReceipt({ hash });
            await loadStats();
            
            toast.success('Successfully unstaked tokens');
        } catch (error) {
            const errorMessage = handleContractError(error);
            setError({
                type: 'transaction',
                message: errorMessage.message,
                details: error
            });
            toast.error(errorMessage.message);
            console.error('Failed to unstake:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-8"
            >
                <p className="text-gray-600 dark:text-gray-400">
                    Please connect your wallet to access staking features
                </p>
            </motion.div>
        );
    }

    return (
        <ClientOnly fallback={<div className="text-center py-6">Loading staking interface...</div>}>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Stake MOR Tokens
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="poolId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Pool
                        </label>
                        <select
                            id="poolId"
                            {...register('poolId')}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select a pool</option>
                            {availablePools.map(pool => (
                                <option key={pool.id} value={pool.id}>
                                    {pool.name}
                                </option>
                            ))}
                        </select>
                        {errors.poolId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.poolId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount (MOR)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                id="amount"
                                {...register('amount')}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="0.0"
                                disabled={isSubmitting}
                            />
                            {balance && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const maxAmount = formatEther(balance.value);
                                            register('amount').onChange({ target: { value: maxAmount } });
                                        }}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                                    >
                                        Max
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.amount.message}
                            </p>
                        )}
                        {balance && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Balance: {formatEther(balance.value)} {balance.symbol}
                            </p>
                        )}
                    </div>

                    <LockPeriodSelector
                        selectedPeriod={selectedLockPeriod}
                        onChange={setSelectedLockPeriod}
                        disabled={isSubmitting}
                    />

                    {/* Token Approval Section */}
                    {needsApproval && watchAmount && watchPoolId && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Token Approval Required</h3>
                            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                You need to approve the staking contract to use your MOR tokens
                            </p>
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={approving}
                                className="mt-2 px-3 py-1.5 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 rounded-md"
                            >
                                {approving ? 'Approving...' : 'Approve MOR Tokens'}
                            </button>
                            {formattedAllowance && (
                                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                    Current allowance: {formattedAllowance} MOR
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* Gas Estimation */}
                    {watchAmount && watchPoolId && stakingContract?.contract && !needsApproval && (
                        <div className="mt-4">
                                <GasEstimator
                                    contractFunction={stakingContract.contract.estimateGas?.stake as any}
                                    args={[watchPoolId as `0x${string}`, parseEther(watchAmount)]}
                                />
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                            {error.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !watchAmount || !watchPoolId || Object.keys(errors).length > 0 || isSubmitting || needsApproval || approving || tokenLoading}
                        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md 
                            ${isLoading || !watchAmount || !watchPoolId || Object.keys(errors).length > 0 || isSubmitting || needsApproval || approving || tokenLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }`}
                    >
                        {isLoading ? 'Processing...' : 
                         isSubmitting ? 'Staking...' : 
                         needsApproval ? 'Approval Required' : 
                         'Stake'}
                    </button>
                </form>
            </motion.div>
        </div>
        </ClientOnly>
    );
}
