import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useConfig } from 'wagmi';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../../utils/networkSwitching';

export const NetworkIndicator = () => {
    const [mounted, setMounted] = useState(false);
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const config = useConfig();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Return null on server-side
    }

    if (!isConnected) {
        return (
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Not Connected</span>
            </div>
        );
    }

    const isSupported = isNetworkSupported(chainId || 0);
    const chain = config.chains.find(c => c.id === chainId);
    const networkName = chain?.name || 'Unknown Network';

    return (
        <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            isSupported 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
        }`}>
            <div className={`w-3 h-3 rounded-full ${
                isSupported 
                    ? 'bg-green-500 dark:bg-green-400' 
                    : 'bg-red-500 dark:bg-red-400'
            }`} />
            <span className={`text-sm ${
                isSupported 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
            }`}>
                {networkName}
                {!isSupported && ' (Unsupported)'}
            </span>
        </div>
    );
};

export default NetworkIndicator; 