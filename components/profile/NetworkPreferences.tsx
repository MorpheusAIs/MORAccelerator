import React, { useState, useEffect } from 'react';
import { useAccount, useConfig, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { SUPPORTED_CHAINS, switchNetwork } from '../../utils/networkSwitching';
import ClientOnly from '../common/ClientOnly';

interface NetworkPreference {
    chainId: number;
    isDefault: boolean;
    customRpc?: string;
}

export const NetworkPreferences: React.FC = () => {
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const config = useConfig();
    const [preferences, setPreferences] = useState<NetworkPreference[]>([]);
    const [customRpc, setCustomRpc] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load saved preferences from localStorage
        const savedPrefs = localStorage.getItem('networkPreferences');
        if (savedPrefs) {
            try {
                setPreferences(JSON.parse(savedPrefs));
            } catch (err) {
                console.error('Failed to load network preferences:', err);
            }
        } else {
            // Set default preferences
            const defaultPrefs: NetworkPreference[] = [
                { chainId: SUPPORTED_CHAINS.ARBITRUM, isDefault: true },
                { chainId: SUPPORTED_CHAINS.BASE, isDefault: false }
            ];
            setPreferences(defaultPrefs);
            localStorage.setItem('networkPreferences', JSON.stringify(defaultPrefs));
        }
    }, []);

    const handleSetDefault = async (newChainId: number) => {
        try {
            await switchNetwork(newChainId);
            const updatedPrefs = preferences.map(pref => ({
                ...pref,
                isDefault: pref.chainId === newChainId
            }));
            setPreferences(updatedPrefs);
            localStorage.setItem('networkPreferences', JSON.stringify(updatedPrefs));
            setError(null);
        } catch (err) {
            setError('Failed to switch network. Please try again.');
        }
    };

    const handleCustomRpcSave = (prefChainId: number) => {
        if (!customRpc) return;

        const updatedPrefs = preferences.map(pref => 
            pref.chainId === prefChainId 
                ? { ...pref, customRpc } 
                : pref
        );
        setPreferences(updatedPrefs);
        localStorage.setItem('networkPreferences', JSON.stringify(updatedPrefs));
        setCustomRpc('');
    };

    if (!isConnected) {
        return (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                    Connect your wallet to manage network preferences
                </p>
            </div>
        );
    }

    return (
        <ClientOnly fallback={
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p>Loading network preferences...</p>
            </div>
        }>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Network Preferences
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {preferences.map((pref) => {
                        const networkConfig = config.chains.find(c => c.id === pref.chainId);
                        if (!networkConfig) return null;

                        return (
                            <motion.div
                                key={pref.chainId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 border dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {networkConfig.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Chain ID: {pref.chainId}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleSetDefault(pref.chainId)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium
                                            ${pref.isDefault
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {pref.isDefault ? 'Default Network' : 'Set as Default'}
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Custom RPC URL (Optional)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={networkConfig.rpcUrls.default.http[0]}
                                            value={pref.chainId === chainId ? customRpc : (pref.customRpc || '')}
                                            onChange={(e) => setCustomRpc(e.target.value)}
                                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => handleCustomRpcSave(pref.chainId)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            </motion.div>
        </ClientOnly>
    );
};
