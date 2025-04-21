import React, { useState, useCallback, useEffect } from 'react';
import { useAccount, usePublicClient, useChainId } from 'wagmi';
import { type Address, formatEther, parseAbiItem } from 'viem';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useTreasuryContract } from '../hooks/useTreasuryContract';
import { handleContractError } from '../utils/contractErrors';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../utils/networkSwitching';
import { BuilderPool } from '../contracts/types/contracts';

interface RewardInfo {
    poolId: `0x${string}`;
    pendingRewards: bigint;
    lastClaimTime: number;
    rewardSplit: number;
}

export function RewardsTracker() {
    const chainId = useChainId();
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rewards, setRewards] = useState<RewardInfo[]>([]);
    const [selectedPool, setSelectedPool] = useState<`0x${string}` | null>(null);

    const { contract: builderContract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    const { contract: treasuryContract } = useTreasuryContract(chainId || SUPPORTED_CHAINS.ARBITRUM);

    const loadRewards = useCallback(async () => {
        if (!builderContract || !treasuryContract || !chainId || !isNetworkSupported(chainId) || !address || !publicClient) return;

        try {
            setIsLoading(true);
            
            // Get all staking events for the user
            const logs = await publicClient.getLogs({
                address: builderContract.address,
                event: parseAbiItem('event Staked(bytes32 indexed poolId, address indexed staker, uint256 amount)'),
                args: {
                    staker: address as Address
                },
                fromBlock: 'earliest'
            });
            
            // Extract unique pool IDs
            const uniquePoolIds = [...new Set(logs
                .map(log => log.args?.poolId)
                .filter((poolId): poolId is `0x${string}` => typeof poolId === 'string' && poolId.startsWith('0x'))
            )];

            // Get reward info for each pool
            const rewardsInfo = await Promise.all(
                uniquePoolIds.map(async (poolId) => {
                    const [poolData, pendingRewards] = await Promise.all([
                        publicClient.readContract({
                            address: builderContract.address,
                            abi: builderContract.abi,
                            functionName: 'getBuilderPool',
                            args: [poolId]
                        }) as Promise<BuilderPool>,
                        publicClient.readContract({
                            address: treasuryContract.address,
                            abi: treasuryContract.abi,
                            functionName: 'getBuilderRewards',
                            args: [poolId]
                        }) as Promise<bigint>
                    ]);

                    return {
                        poolId,
                        pendingRewards,
                        lastClaimTime: Number(poolData.lastRewardClaim),
                        rewardSplit: Number(poolData.rewardSplit)
                    };
                })
            );

            setRewards(rewardsInfo);
        } catch (err: any) {
            const contractError = handleContractError(err);
            setError(contractError.message);
        } finally {
            setIsLoading(false);
        }
    }, [builderContract, treasuryContract, chainId, address, publicClient]);

    const claimRewards = useCallback(async (poolId: `0x${string}`) => {
        if (!builderContract || !chainId || !isNetworkSupported(chainId) || !address || !publicClient) return;

        try {
            setIsLoading(true);
            const hash = await builderContract.write.claimRewards([poolId], {
                account: address as `0x${string}`,
                chain: publicClient.chain
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            
            if (receipt.status === 'success') {
                await loadRewards();
            } else {
                setError('Transaction failed');
            }
        } catch (err: any) {
            const contractError = handleContractError(err);
            setError(contractError.message);
        } finally {
            setIsLoading(false);
        }
    }, [builderContract, chainId, address, publicClient, loadRewards]);

    useEffect(() => {
        loadRewards();
        const interval = setInterval(loadRewards, 15000);
        return () => clearInterval(interval);
    }, [loadRewards]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Rewards Tracker</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="space-y-4">
                {rewards.map((reward) => (
                    <div
                        key={reward.poolId}
                        className={`p-4 rounded-lg border ${
                            selectedPool === reward.poolId
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPool(reward.poolId)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Pool ID: {reward.poolId}</h3>
                                <p className="text-sm text-gray-600">
                                    Reward Split: {reward.rewardSplit}%
                                </p>
                                <p className="text-sm text-gray-600">
                                    Last Claim:{' '}
                                    {new Date(reward.lastClaimTime * 1000).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">
                                    {formatEther(reward.pendingRewards)} MOR
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        claimRewards(reward.poolId);
                                    }}
                                    disabled={isLoading || reward.pendingRewards === 0n}
                                    className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {isLoading && selectedPool === reward.poolId
                                        ? 'Claiming...'
                                        : 'Claim'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {rewards.length === 0 && !isLoading && (
                    <p className="text-center text-gray-500">
                        No rewards found. Stake in a builder pool to start earning rewards.
                    </p>
                )}

                {isLoading && rewards.length === 0 && (
                    <div className="text-center text-gray-500">Loading rewards...</div>
                )}
            </div>
        </div>
    );
} 