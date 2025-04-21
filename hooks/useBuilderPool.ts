import { useCallback, useMemo } from 'react';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { type Address, type Hash, parseEther, formatEther } from 'viem';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { handleContractError } from '../utils/contractErrors';

interface CreatePoolParams {
  name: string;
  minStake: string;
  maxStake: string;
  apr: string;
  description: string;
}

interface PoolData {
  id: string;
  name: string;
  totalStaked: bigint;
  apr: number;
  minStake: bigint;
  maxStake: bigint;
  status: 'active' | 'paused' | 'closed';
  description: string;
}

type PoolStatus = 'active' | 'paused' | 'closed';
const POOL_STATUSES: PoolStatus[] = ['active', 'paused', 'closed'];

export function useBuilderPool() {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!publicClient) return null;

    const network = Object.values(NETWORK_CONFIG).find(
      (config) => config.chainId === chainId
    );
    if (!network) return null;

    return {
      address: network.contracts.builder as Address,
      publicClient,
      walletClient
    };
  }, [chainId, publicClient, walletClient]);

  const createPool = useCallback(
    async (params: CreatePoolParams): Promise<Hash> => {
      if (!contract || !walletClient || !publicClient) {
        throw new Error('Contract not initialized');
      }

      try {
        const { request } = await publicClient.simulateContract({
          address: contract.address,
          abi: [
            {
              inputs: [
                { name: 'name', type: 'string' },
                { name: 'minStake', type: 'uint256' },
                { name: 'maxStake', type: 'uint256' },
                { name: 'apr', type: 'uint256' },
                { name: 'description', type: 'string' }
              ],
              name: 'createPool',
              outputs: [{ name: 'poolId', type: 'bytes32' }],
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ],
          functionName: 'createPool',
          args: [
            params.name,
            parseEther(params.minStake),
            parseEther(params.maxStake),
            BigInt(Math.floor(Number(params.apr) * 100)), // Convert APR to basis points
            params.description
          ]
        });

        return await walletClient.writeContract(request);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    [contract, publicClient, walletClient]
  );

  const getPool = useCallback(
    async (poolId: string): Promise<PoolData> => {
      if (!contract || !publicClient) {
        throw new Error('Contract not initialized');
      }

      try {
        const data = await publicClient.readContract({
          address: contract.address,
          abi: [
            {
              inputs: [{ name: 'poolId', type: 'bytes32' }],
              name: 'getPool',
              outputs: [
                {
                  components: [
                    { name: 'name', type: 'string' },
                    { name: 'totalStaked', type: 'uint256' },
                    { name: 'apr', type: 'uint256' },
                    { name: 'minStake', type: 'uint256' },
                    { name: 'maxStake', type: 'uint256' },
                    { name: 'status', type: 'uint8' },
                    { name: 'description', type: 'string' }
                  ],
                  name: 'pool',
                  type: 'tuple'
                }
              ],
              stateMutability: 'view',
              type: 'function'
            }
          ],
          functionName: 'getPool',
          args: [poolId as `0x${string}`]
        });

        // Type assertion for the contract response
        type PoolResponse = {
          name: string;
          totalStaked: bigint;
          apr: bigint;
          minStake: bigint;
          maxStake: bigint;
          status: number;
          description: string;
        };

        const poolData = data as unknown as PoolResponse;

        return {
          id: poolId,
          name: poolData.name,
          totalStaked: poolData.totalStaked,
          apr: Number(poolData.apr) / 100, // Convert basis points to percentage
          minStake: poolData.minStake,
          maxStake: poolData.maxStake,
          status: POOL_STATUSES[poolData.status] || 'closed',
          description: poolData.description
        };
      } catch (error) {
        throw handleContractError(error);
      }
    },
    [contract, publicClient]
  );

  const getPools = useCallback(async (): Promise<PoolData[]> => {
    if (!contract || !publicClient) {
      throw new Error('Contract not initialized');
    }

    try {
      const events = await publicClient.getLogs({
        address: contract.address,
        event: {
          inputs: [
            { indexed: true, name: 'poolId', type: 'bytes32' },
            { indexed: false, name: 'name', type: 'string' },
            { indexed: true, name: 'creator', type: 'address' }
          ],
          name: 'PoolCreated',
          type: 'event'
        },
        fromBlock: 'earliest'
      });

      const poolPromises = events.map((event) => {
        if (event.args?.poolId) {
          return getPool(event.args.poolId);
        }
        return null;
      });

      const pools = await Promise.all(poolPromises);
      return pools.filter((pool): pool is PoolData => pool !== null);
    } catch (error) {
      throw handleContractError(error);
    }
  }, [contract, publicClient, getPool]);

  return {
    createPool,
    getPool,
    getPools
  };
} 