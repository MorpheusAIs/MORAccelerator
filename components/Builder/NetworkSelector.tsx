import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import Image from 'next/image';

interface NetworkSelectorProps {
    onNetworkChange?: (networkId: string) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkChange }) => {
    const { chain } = useNetwork();
    const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork();

    const networkLogos = {
        arbitrum: '/networks/arbitrum.svg',
        base: '/networks/base.svg'
    };

    const handleNetworkChange = async (chainId: number) => {
        try {
            await switchNetwork?.(chainId);
            const network = Object.entries(SUPPORTED_NETWORKS).find(
                ([_, config]) => config.chainId === chainId
            );
            if (network) {
                onNetworkChange?.(network[0]);
            }
        } catch (error) {
            console.error('Error switching network:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Select Network</h3>
            
            <div className="space-y-2">
                {Object.entries(SUPPORTED_NETWORKS).map(([networkId, config]) => (
                    <button
                        key={networkId}
                        onClick={() => handleNetworkChange(config.chainId)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            chain?.id === config.chainId
                                ? 'bg-blue-50 border-2 border-blue-500'
                                : 'bg-gray-50 hover:bg-gray-100'
                        } ${isLoading && pendingChainId === config.chainId ? 'opacity-50 cursor-wait' : ''}`}
                        disabled={isLoading}
                    >
                        <div className="flex items-center space-x-3">
                            {networkLogos[networkId as keyof typeof networkLogos] && (
                                <div className="w-6 h-6 relative">
                                    <Image
                                        src={networkLogos[networkId as keyof typeof networkLogos]}
                                        alt={config.name}
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                            )}
                            <span className="font-medium">{config.name}</span>
                        </div>

                        {chain?.id === config.chainId && (
                            <span className="text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="mt-4 text-sm text-gray-600">
                    Switching networks...
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
                <p>Current Network: {chain?.name || 'Not connected'}</p>
                <p className="mt-1">
                    Make sure your wallet supports the selected network.
                </p>
            </div>
        </div>
    );
};

export default NetworkSelector;