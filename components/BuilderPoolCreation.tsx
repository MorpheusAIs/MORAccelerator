import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { parseEther, Hash } from 'viem';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { handleContractError } from '../utils/contractErrors';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../utils/networkSwitching';
import { BuilderPoolCreationParams } from '../contracts/types/contracts';

interface BuilderPoolFormData {
    name: string;
    initialStake: string;
    rewardSplit: string;
    lockPeriod: string;
}

export function BuilderPoolCreation() {
    const chainId = useChainId();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { contract: builderContract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<BuilderPoolFormData>();

    const onSubmit = async (data: BuilderPoolFormData) => {
        if (!builderContract || !chainId || !isNetworkSupported(chainId) || !address || !publicClient) {
            setError('Please connect to a supported network');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            const params = [
                data.name,
                parseEther(data.initialStake),
                BigInt(parseInt(data.lockPeriod) * 86400), // Convert days to seconds
                BigInt(parseInt(data.rewardSplit))
            ] as const;

            const hash = await builderContract.write.createBuilderPool(params, {
                account: address as `0x${string}`,
                chain: publicClient.chain
            });

            // Wait for transaction confirmation
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            
            if (receipt.status === 'success') {
                setSuccess(true);
                reset();
            } else {
                setError('Transaction failed');
            }
        } catch (err: unknown) {
            const contractError = handleContractError(err as Error);
            setError(contractError.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="text-center py-6">
                <p className="text-gray-600">Connect your wallet to create a builder pool</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Create Builder Pool</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {success && (
                <p className="text-green-600 mb-4">
                    Builder pool created successfully!
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Pool Name
                    </label>
                    <input
                        type="text"
                        {...register('name', { required: 'Pool name is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Initial Stake (MOR)
                    </label>
                    <input
                        type="number"
                        step="0.000000000000000001"
                        {...register('initialStake', {
                            required: 'Initial stake is required',
                            min: { value: 0, message: 'Initial stake must be positive' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.initialStake && (
                        <p className="mt-1 text-sm text-red-600">{errors.initialStake.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Lock Period (Days)
                    </label>
                    <input
                        type="number"
                        {...register('lockPeriod', {
                            required: 'Lock period is required',
                            min: { value: 1, message: 'Lock period must be at least 1 day' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.lockPeriod && (
                        <p className="mt-1 text-sm text-red-600">{errors.lockPeriod.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Reward Split (%)
                    </label>
                    <input
                        type="number"
                        {...register('rewardSplit', {
                            required: 'Reward split is required',
                            min: { value: 0, message: 'Reward split must be between 0 and 100' },
                            max: { value: 100, message: 'Reward split must be between 0 and 100' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.rewardSplit && (
                        <p className="mt-1 text-sm text-red-600">{errors.rewardSplit.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Creating...' : 'Create Pool'}
                </button>
            </form>
        </div>
    );
} 