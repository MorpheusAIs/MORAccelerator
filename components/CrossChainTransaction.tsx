import React, { useState, useCallback } from 'react';
import { useChainId } from 'wagmi';
import { type Address, type Hash } from 'viem';
import { useCrossChain } from '../hooks/useCrossChain';
import { type CrossChainMessage } from '../services/LayerZeroService';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';
import TransactionNotification from './common/TransactionNotification';

interface CrossChainTransactionProps {
    contract: any;
    message: CrossChainMessage;
    onSuccess?: (txHash: Hash) => void;
    onError?: (error: Error) => void;
}

export const CrossChainTransaction: React.FC<CrossChainTransactionProps> = ({
    contract,
    message,
    onSuccess,
    onError
}) => {
    const chainId = useChainId();
    const {
        isLoading,
        error,
        txHash,
        estimatedFees,
        estimateFees,
        sendMessage,
        resetState
    } = useCrossChain();

    const [showNotification, setShowNotification] = useState(false);

    const handleSend = useCallback(async () => {
        try {
            if (!estimatedFees) {
                await estimateFees(message, contract);
                return;
            }

            const hash = await sendMessage(message, contract);
            setShowNotification(true);
            onSuccess?.(hash);
        } catch (err) {
            onError?.(err as Error);
        }
    }, [message, contract, estimatedFees, estimateFees, sendMessage, onSuccess, onError]);

    const handleCloseNotification = useCallback(() => {
        setShowNotification(false);
        resetState();
    }, [resetState]);

    const isCorrectChain = chainId === message.srcChainId;
    const buttonDisabled = !isCorrectChain || isLoading || !estimatedFees;

    return (
        <div className="space-y-4">
            {!isCorrectChain && (
                <div className="text-sm text-red-600 dark:text-red-400">
                    Please switch to the correct network to proceed
                </div>
            )}

            <button
                onClick={handleSend}
                disabled={buttonDisabled}
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md 
                    ${buttonDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    }`}
            >
                {isLoading
                    ? 'Processing...'
                    : estimatedFees
                        ? 'Send Message'
                        : 'Estimate Fees'
                }
            </button>

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {showNotification && txHash && (
                <TransactionNotification
                    hash={txHash}
                    status="pending"
                    message="Cross-chain message sent"
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default CrossChainTransaction; 