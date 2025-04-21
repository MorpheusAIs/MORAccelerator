import React, { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { StakingContractWriteMethods } from '../../types/contracts';

interface GasEstimatorProps {
    contractFunction: keyof StakingContractWriteMethods;
    args: any[];
}

export function GasEstimator({ contractFunction, args }: GasEstimatorProps) {
    const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);
    const [gasPrice, setGasPrice] = useState<bigint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const publicClient = usePublicClient();

    useEffect(() => {
        const estimateGas = async () => {
            try {
                setError(null);
                const [gasEstimate, currentGasPrice] = await Promise.all([
                    publicClient.estimateContractGas({
                        address: args[0],
                        abi: [], // This should be filled with the actual ABI
                        functionName: contractFunction,
                        args: args.slice(1)
                    }),
                    publicClient.getGasPrice()
                ]);

                setEstimatedGas(gasEstimate);
                setGasPrice(currentGasPrice);
            } catch (err) {
                console.error('Failed to estimate gas:', err);
                setError('Failed to estimate gas cost');
            }
        };

        estimateGas();
    }, [publicClient, contractFunction, args]);

    if (error) {
        return (
            <div className="text-sm text-red-600 dark:text-red-400">
                {error}
            </div>
        );
    }

    if (!estimatedGas || !gasPrice) {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Estimating gas...
            </div>
        );
    }

    const totalCost = (estimatedGas * gasPrice);

    return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Estimated Gas: {formatEther(estimatedGas)} ETH</p>
            <p>Gas Price: {formatEther(gasPrice)} ETH</p>
            <p>Total Cost: {formatEther(totalCost)} ETH</p>
        </div>
    );
} 