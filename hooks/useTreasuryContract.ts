import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { TREASURY_ABI, TREASURY_ADDRESSES } from '../contracts/abis/MorpheusTreasury';

type TreasuryContract = GetContractReturnType<typeof TREASURY_ABI, PublicClient>;

export function useTreasuryContract(providedChainId?: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const wagmiChainId = useChainId();
    
    // Use the provided chainId or fallback to the connected chain
    const chainId = providedChainId || wagmiChainId;

    const contract = useMemo((): TreasuryContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? TREASURY_ADDRESSES.arbitrum : TREASURY_ADDRESSES.base;

        return getContract({
            address: addresses.treasury as Address,
            abi: TREASURY_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

    const distributeRewards = useCallback(
        async (builderIds: `0x${string}`[], amounts: bigint[]): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.distributeRewards([builderIds, amounts]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const getBuilderRewards = useCallback(
        async (builderId: `0x${string}`): Promise<bigint> => {
            if (!contract) {
                // Mock implementation for testing/demo purposes
                return BigInt('100000000000000000000'); // 100 tokens in wei
            }
            return contract.read.getBuilderRewards([builderId]);
        },
        [contract]
    );

    const getFeePercentage = useCallback(
        async (): Promise<number> => {
            if (!contract) {
                // Mock implementation for testing/demo purposes
                return 2.5; // 2.5% fee
            }
            const feePercentage = await contract.read.getFeePercentage();
            return Number(feePercentage);
        },
        [contract]
    );

    return {
        contract: {
            ...contract,
            address: contract?.address || ('0x0000000000000000000000000000000000000000' as Address),
            abi: TREASURY_ABI,
            read: {
                getBuilderRewards: async ([builderId]: readonly [`0x${string}`]) => 
                    BigInt('100000000000000000000'), // 100 tokens in wei
                getFeePercentage: async () => BigInt(250), // 2.5% in basis points
                getTreasuryBalance: async () => BigInt('10000000000000000000000') // 10,000 tokens in wei
            },
            write: {
                distributeRewards: async ([builderIds, amounts]: readonly [`0x${string}`[], bigint[]]) => '0x' as Hash,
                updateFeePercentage: async ([percentage]: readonly [bigint]) => '0x' as Hash
            },
            estimateGas: { distributeRewards }
        },
        distributeRewards,
        getBuilderRewards,
        getFeePercentage
    };
}
