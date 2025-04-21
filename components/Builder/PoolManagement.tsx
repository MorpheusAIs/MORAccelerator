import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, usePublicClient, useBalance, useChainId } from 'wagmi';
import dynamic from 'next/dynamic';
import { formatEther } from 'viem';
import CreatePoolForm, { type PoolFormData } from './CreatePoolForm';
import { useBuilderPool } from '../../hooks/useBuilderPool';
import { toast } from 'react-hot-toast';
import NetworkCheck from '../common/NetworkCheck';
import WalletErrorHandler from '../common/WalletErrorHandler';
import { ContractErrorType } from '../../utils/contractErrors';

// Dynamically import components that might cause hydration issues
const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  { ssr: false }
);

export default function PoolManagement() {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({
    address: address,
  });
  
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [pools, setPools] = useState<Array<{
    id: string;
    name: string;
    totalStaked: bigint;
    apr: number;
    minStake: bigint;
    maxStake: bigint;
    status: 'active' | 'paused' | 'closed';
    description: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{type: ContractErrorType; message: string} | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { createPool, getPools } = useBuilderPool();

  // Client-side only rendering to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadPools();
    }
  }, [isConnected, chainId]);

  const loadPools = async () => {
    try {
      setIsLoading(true);
      const poolsData = await getPools();
      setPools(poolsData);
    } catch (error) {
      console.error('Failed to load pools:', error);
      toast.error('Failed to load pools. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePool = async (data: PoolFormData) => {
    try {
      setError(null);
      
      // Check if user has enough balance for gas
      if (balanceData && balanceData.value < BigInt(1e16)) { // 0.01 ETH minimum for gas
        setError({
          type: ContractErrorType.INSUFFICIENT_BALANCE,
          message: 'Your wallet balance may be too low to cover gas fees for this transaction.'
        });
        return;
      }
      
      const hash = await createPool(data);
      toast.success('Pool creation transaction submitted!');
      
      // Wait for transaction confirmation using wagmi
      if (!publicClient) {
        throw new Error('Public client not initialized');
      }
      await publicClient.waitForTransactionReceipt({ hash });
      await loadPools();
      
      setIsCreatingPool(false);
      toast.success('Pool created successfully!');
    } catch (error: any) {
      console.error('Failed to create pool:', error);
      
      // Handle specific error types
      if (error.type && Object.values(ContractErrorType).includes(error.type)) {
        setError(error);
      } else if (error.message && error.message.includes('insufficient funds')) {
        setError({
          type: ContractErrorType.INSUFFICIENT_BALANCE,
          message: 'Your wallet balance is too low to complete this transaction.'
        });
      } else if (error.message && error.message.includes('network')) {
        setError({
          type: ContractErrorType.NETWORK_ERROR,
          message: 'Please check your network connection and try again.'
        });
      } else {
        setError({
          type: ContractErrorType.CONTRACT_ERROR,
          message: 'Failed to create pool. Please try again.'
        });
      }
    }
  };

  // Only render after client-side mount to prevent hydration errors
  if (!isMounted) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse w-8 h-8 bg-blue-600 rounded-full"></div>
    </div>;
  }
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to manage builder pools
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Network check component */}
      <NetworkCheck>
        {/* Error handler */}
        {error && (
          <WalletErrorHandler 
            error={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Builder Pool Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreatingPool(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Pool
          </motion.button>
        </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : pools.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            No pools found. Create your first pool to get started!
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {pool.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    pool.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : pool.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <span className="font-medium">Total Staked:</span>{' '}
                  {formatEther(pool.totalStaked)} ETH
                </p>
                <p>
                  <span className="font-medium">APR:</span> {pool.apr}%
                </p>
                <p>
                  <span className="font-medium">Min Stake:</span>{' '}
                  {formatEther(pool.minStake)} ETH
                </p>
                <p>
                  <span className="font-medium">Max Stake:</span>{' '}
                  {formatEther(pool.maxStake)} ETH
                </p>
                <p className="text-sm mt-4">{pool.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {isCreatingPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
          >
            <CreatePoolForm
              onSubmit={handleCreatePool}
              onCancel={() => setIsCreatingPool(false)}
              onError={setError}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
} 