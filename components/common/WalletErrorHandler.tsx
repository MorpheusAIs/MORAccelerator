import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ContractErrorType } from '../../utils/contractErrors';

interface WalletErrorProps {
  error?: {
    type: ContractErrorType;
    message: string;
    details?: any;
  };
  onClose: () => void;
}

const WalletErrorHandler: React.FC<WalletErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  let alertStatus: 'error' | 'warning' | 'info' = 'error';
  let title = 'Error';

  // Customize based on error type
  switch (error.type) {
    case ContractErrorType.INSUFFICIENT_BALANCE:
      alertStatus = 'warning';
      title = 'Insufficient Balance';
      break;
    case ContractErrorType.NETWORK_ERROR:
      alertStatus = 'warning';
      title = 'Network Error';
      break;
    case ContractErrorType.UNAUTHORIZED:
      alertStatus = 'info';
      title = 'Not Authorized';
      break;
    case ContractErrorType.INVALID_PARAMETERS:
      alertStatus = 'warning';
      title = 'Invalid Input';
      break;
  }

  return (
    <div className={`rounded-lg p-4 mb-4 animate-fadeIn ${
      alertStatus === 'error' ? 'bg-red-100 border border-red-400 text-red-800' :
      alertStatus === 'warning' ? 'bg-yellow-100 border border-yellow-400 text-yellow-800' :
      'bg-blue-100 border border-blue-400 text-blue-800'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {alertStatus === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {alertStatus === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {alertStatus === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm">
            {error.message}
          </div>
        </div>
        <button 
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WalletErrorHandler;
