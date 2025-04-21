import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractService } from '../../hooks/useContractService';
import { useNetwork, useChainId, useBalance } from 'wagmi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { parseEther, formatEther } from 'viem';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface StakingInterfaceProps {
    builderId: string;
}

interface BuilderInfo {
    name: string;
    totalStaked: string;
    lockPeriod: number;
    rewardSplit: number;
}

const stakingSchema = z.object({
    amount: z.string().min(1, 'Amount is required'),
    lockPeriod: z.string().min(1, 'Lock period is required'),
});

type StakingFormData = z.infer<typeof stakingSchema>;

export const StakingInterface: React.FC<StakingInterfaceProps> = ({ builderId }) => {
    const { chain } = useNetwork();
    const contractService = useContractService();
    const chainId = useChainId();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StakingFormData>({
        resolver: zodResolver(stakingSchema),
    });

    const [builderInfo, setBuilderInfo] = useState<BuilderInfo | null>(null);
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [pendingRewards, setPendingRewards] = useState<string>('0');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch builder info and rewards
    const fetchBuilderInfo = async () => {
        if (!chain?.id || !contractService) return;

        try {
            const info = await contractService.getBuilderInfo(chain.id, builderId);
            setBuilderInfo({
                name: info.name,
                totalStaked: ethers.utils.formatEther(info.totalStaked),
                lockPeriod: info.lockPeriod.toNumber(),
                rewardSplit: info.rewardSplit.toNumber()
            });

            const rewards = await contractService.getBuilderRewards(chain.id, builderId);
            setPendingRewards(ethers.utils.formatEther(rewards));
        } catch (error) {
            console.error('Error fetching builder info:', error);
        }
    };

    useEffect(() => {
        fetchBuilderInfo();
        // Set up an interval to refresh data
        const interval = setInterval(fetchBuilderInfo, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, [chain?.id, builderId]);

    const onSubmit = async (data: StakingFormData) => {
        if (!chain?.id || !contractService) {
            setError('Contract service not initialized');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            
            // Convert amount to wei
            const amountInWei = parseEther(data.amount);
            const lockPeriodInSeconds = BigInt(parseInt(data.lockPeriod) * 86400); // Convert days to seconds
            
            // Call contract to stake
            const tx = await contractService.stake(chain.id, builderId, amountInWei, lockPeriodInSeconds);
            
            toast.info('Staking transaction submitted...', {
                position: "top-right",
                autoClose: 5000,
            });

            await tx.wait();
            
            toast.success('Successfully staked!', {
                position: "top-right",
                autoClose: 5000,
            });

            // Refresh builder info
            await fetchBuilderInfo();
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while staking';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnstake = async () => {
        if (!chain?.id || !contractService) {
            setError('Contract service not initialized');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            
            // Call contract to unstake
            const tx = await contractService.unstake(chain.id, builderId);
            
            toast.info('Unstaking transaction submitted...', {
                position: "top-right",
                autoClose: 5000,
            });

            await tx.wait();
            
            toast.success('Successfully unstaked!', {
                position: "top-right",
                autoClose: 5000,
            });

            // Refresh builder info
            await fetchBuilderInfo();
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while unstaking';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!chain?.id || !contractService) return;

        try {
            setIsLoading(true);
            const tx = await contractService.claimRewards(chain.id, builderId);

            toast.info('Claiming rewards...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            await tx.wait();

            toast.success('Successfully claimed rewards!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            fetchBuilderInfo();
        } catch (error: any) {
            toast.error(error.message || 'Failed to claim rewards', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!builderInfo) {
        return <div>Loading builder information...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-dark-surface rounded-lg shadow-lg border border-dark-surface/20">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-onBg">{builderInfo.name}</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-dark-bg p-4 rounded-lg">
                        <p className="text-sm text-dark-onBg/70">Total Staked</p>
                        <p className="text-xl font-semibold text-dark-onBg">{builderInfo.totalStaked} MOR</p>
                    </div>
                    <div className="bg-dark-bg p-4 rounded-lg">
                        <p className="text-sm text-dark-onBg/70">Pending Rewards</p>
                        <p className="text-xl font-semibold text-dark-onBg">{pendingRewards} MOR</p>
                    </div>
                </div>
            </div>

            {/* Staking Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-dark-onBg/70">
                        Stake Amount
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="amount"
                            step="0.000000000000000001"
                            className="w-full px-3 py-2 bg-dark-bg border border-dark-surface/20 rounded-md shadow-sm focus:ring-dark-primary focus:border-dark-primary text-dark-onBg"
                            {...register('amount')}
                        />
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="lockPeriod" className="block text-sm font-medium text-dark-onBg/70">
                        Lock Period (days)
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="lockPeriod"
                            min="1"
                            className="w-full px-3 py-2 bg-dark-bg border border-dark-surface/20 rounded-md shadow-sm focus:ring-dark-primary focus:border-dark-primary text-dark-onBg"
                            {...register('lockPeriod')}
                        />
                        {errors.lockPeriod && (
                            <p className="mt-1 text-sm text-red-500">{errors.lockPeriod.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-dark-primary text-dark-onPrimary rounded-md hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-dark-primary focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Staking...' : 'Stake'}
                    </button>

                    <button
                        type="button"
                        onClick={handleUnstake}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-dark-error text-dark-onError rounded-md hover:bg-dark-error/90 focus:outline-none focus:ring-2 focus:ring-dark-error focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Unstaking...' : 'Unstake'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-dark-error/10 border border-dark-error rounded-md">
                    <p className="text-dark-error">{error}</p>
                </div>
            )}

            {/* Claim Rewards Button */}
            <div className="mt-6">
                <button
                    onClick={handleClaimRewards}
                    disabled={isLoading || Number(pendingRewards) <= 0}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-dark-primary hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-primary disabled:opacity-50"
                >
                    {Number(pendingRewards) > 0 ? `Claim ${pendingRewards} MOR` : 'No Rewards to Claim'}
                </button>
            </div>

            {/* Pool Info */}
            <div className="mt-6 p-4 bg-dark-bg rounded">
                <h3 className="text-lg font-semibold mb-2 text-dark-onBg">Pool Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-dark-onBg/70">
                    <div>
                        <p className="text-gray-600">Lock Period</p>
                        <p className="font-medium">
                            {builderInfo.lockPeriod === 0 
                                ? 'No Lock' 
                                : `${builderInfo.lockPeriod / (60 * 60 * 24)} days`}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Reward Split</p>
                        <p className="font-medium">{builderInfo.rewardSplit}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};