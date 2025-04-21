import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicClient } from 'wagmi';
import { type Hash } from 'viem';
import TransactionNotification from '../common/TransactionNotification';

interface TransactionStatusProps {
    hash: Hash;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
    hash,
    onSuccess,
    onError
}) => {
    const publicClient = usePublicClient();
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        const checkTransaction = async () => {
            try {
                const receipt = await publicClient.waitForTransactionReceipt({ 
                    hash,
                    confirmations: 2,
                    timeout: 60_000
                });

                if (receipt.status === 'success') {
                    setStatus('success');
                    onSuccess?.();
                } else {
                    setStatus('error');
                    onError?.(new Error('Transaction failed'));
                }
            } catch (error) {
                setStatus('error');
                onError?.(error as Error);
            }
        };

        checkTransaction();
    }, [hash, publicClient, onSuccess, onError]);

    const handleClose = () => {
        setShowNotification(false);
    };

    const statusConfig = {
        pending: {
            message: 'Transaction in progress...',
            icon: (
                <svg className="animate-spin h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )
        },
        success: {
            message: 'Transaction successful!',
            icon: (
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        error: {
            message: 'Transaction failed',
            icon: (
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        }
    };

    return (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <TransactionNotification
                        hash={hash}
                        status={status}
                        message={statusConfig[status].message}
                        onClose={handleClose}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 