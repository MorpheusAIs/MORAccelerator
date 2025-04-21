import React from 'react';
import { type Hash } from 'viem';

interface TransactionNotificationProps {
    hash: Hash;
    status: 'pending' | 'success' | 'error';
    message: string;
    onClose: () => void;
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({
    hash,
    status,
    message,
    onClose
}) => {
    const statusColors = {
        pending: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    };

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg border ${statusColors[status]} shadow-lg max-w-md`}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    {status === 'pending' && (
                        <svg className="animate-spin h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    {status === 'success' && (
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {status === 'error' && (
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {message}
                    </p>
                    <a
                        href={`https://arbiscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 block"
                    >
                        View on Arbiscan
                    </a>
                </div>

                <button
                    onClick={onClose}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TransactionNotification; 