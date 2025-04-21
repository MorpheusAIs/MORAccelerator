import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type Hash, type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { FEE_CONFIG_ABI, FEE_CONFIG_ADDRESSES } from '../contracts/abis/FeeConfig';

type FeeConfigContract = GetContractReturnType<typeof FEE_CONFIG_ABI, PublicClient>;

export function useFeeConfig(chainId: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const contract = useMemo((): FeeConfigContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? FEE_CONFIG_ADDRESSES.arbitrum : FEE_CONFIG_ADDRESSES.base;

        return getContract({
            address: addresses.feeConfig as Address,
            abi: FEE_CONFIG_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

    const getFeePercentage = useCallback(
        async (): Promise<number> => {
            if (!contract) throw new Error('Contract not initialized');
            const feePercentage = await contract.read.getFeePercentage();
            return Number(feePercentage);
        },
        [contract]
    );

    const getFeeCollector = useCallback(
        async (): Promise<Address> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getFeeCollector();
        },
        [contract]
    );

    const calculateFee = useCallback(
        async (amount: bigint): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.calculateFee([amount]);
        },
        [contract]
    );

    return {
        contract,
        getFeePercentage,
        getFeeCollector,
        calculateFee
    };
} 