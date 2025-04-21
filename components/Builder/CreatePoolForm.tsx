import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { parseEther, formatEther } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { z } from 'zod';
import { NETWORK_CONFIG } from '../../contracts/config/networks';
import { ContractErrorType } from '../../utils/contractErrors';

interface CreatePoolFormProps {
  onSubmit: (data: PoolFormData) => void;
  onCancel: () => void;
  onError?: (error: {type: ContractErrorType; message: string}) => void;
}

export const poolFormSchema = z.object({
  name: z.string().min(3, 'Pool name must be at least 3 characters'),
  minStake: z.string().refine((val) => {
    try {
      const amount = parseEther(val);
      return amount > 0n;
    } catch {
      return false;
    }
  }, 'Invalid minimum stake amount'),
  maxStake: z.string().refine((val) => {
    try {
      const amount = parseEther(val);
      return amount > 0n;
    } catch {
      return false;
    }
  }, 'Invalid maximum stake amount'),
  apr: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0 && num <= 100;
  }, 'APR must be between 0 and 100'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
}).refine(data => {
  try {
    const min = parseEther(data.minStake);
    const max = parseEther(data.maxStake);
    return max >= min;
  } catch {
    return false;
  }
}, {
  message: "Maximum stake must be greater than or equal to minimum stake",
  path: ["maxStake"]
});

export type PoolFormData = z.infer<typeof poolFormSchema>;

const CreatePoolForm: React.FC<CreatePoolFormProps> = ({ onSubmit, onCancel, onError }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({
    address: address,
  });
  
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  const [balanceWarning, setBalanceWarning] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PoolFormData>();
  
  const minStakeValue = watch('minStake');
  const maxStakeValue = watch('maxStake');
  
  // Check if current network is supported
  useEffect(() => {
    const isSupported = Object.values(NETWORK_CONFIG).some(
      (config) => config.chainId === chainId
    );
    
    if (!isSupported) {
      const supportedNetworks = Object.values(NETWORK_CONFIG).map(n => n.name).join(' or ');
      setNetworkWarning(`Please switch to ${supportedNetworks} to create a pool`);
    } else {
      setNetworkWarning(null);
    }
  }, [chainId]);
  
  // Check if user has enough balance for gas
  useEffect(() => {
    if (balanceData && balanceData.value < BigInt(1e16)) { // 0.01 ETH minimum for gas
      setBalanceWarning(`Low balance (${formatEther(balanceData.value)} ETH). You may not have enough for gas fees.`);
    } else {
      setBalanceWarning(null);
    }
  }, [balanceData]);

  const onFormSubmit = async (data: PoolFormData) => {
    try {
      // Validate network
      if (networkWarning) {
        if (onError) {
          onError({
            type: ContractErrorType.NETWORK_ERROR,
            message: networkWarning
          });
        }
        return;
      }
      
      // Validate balance
      if (balanceWarning) {
        if (onError) {
          onError({
            type: ContractErrorType.INSUFFICIENT_BALANCE,
            message: balanceWarning
          });
        }
        return;
      }
      
      const validatedData = poolFormSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error: any) {
      console.error('Form validation error:', error);
      
      if (error.errors && onError) {
        onError({
          type: ContractErrorType.INVALID_PARAMETERS,
          message: error.errors[0]?.message || 'Invalid form data'
        });
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Pool Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="minStake"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Minimum Stake (ETH)
        </label>
        <input
          type="text"
          id="minStake"
          {...register('minStake')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.minStake && (
          <p className="mt-1 text-sm text-red-600">{errors.minStake.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="maxStake"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Maximum Stake (ETH)
        </label>
        <input
          type="text"
          id="maxStake"
          {...register('maxStake')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.maxStake && (
          <p className="mt-1 text-sm text-red-600">{errors.maxStake.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="apr"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          APR (%)
        </label>
        <input
          type="number"
          id="apr"
          {...register('apr')}
          min="0"
          max="100"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.apr && (
          <p className="mt-1 text-sm text-red-600">{errors.apr.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Warning messages */}
      {(networkWarning || balanceWarning) && (
        <div className="mt-4">
          {networkWarning && (
            <div className="p-3 mb-2 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{networkWarning}</p>
                </div>
              </div>
            </div>
          )}
          {balanceWarning && (
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{balanceWarning}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Form validation summary */}
      {minStakeValue && maxStakeValue && (
        <div className="mt-4">
          <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-gray-800 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-200">
            <h4 className="text-sm font-medium">Pool Configuration Summary</h4>
            <ul className="mt-2 text-sm space-y-1">
              <li>Minimum Stake: {minStakeValue} ETH</li>
              <li>Maximum Stake: {maxStakeValue} ETH</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !!networkWarning}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Pool'}
        </button>
      </div>
    </motion.form>
  );
};

export default CreatePoolForm; 