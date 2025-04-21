import { BaseError } from 'viem';

export enum ContractErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TRANSACTION_ERROR = 'TRANSACTION_ERROR',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
    CONTRACT_ERROR = 'CONTRACT_ERROR'
}

export interface ContractError {
    type: ContractErrorType;
    message: string;
    details?: any;
}

export function handleContractError(error: unknown): ContractError {
    // Network errors
    if (error instanceof BaseError) {
        if (error.message.includes('network changed')) {
            return {
                type: ContractErrorType.NETWORK_ERROR,
                message: 'Network connection changed. Please check your wallet connection.',
                details: error
            };
        }

        // Insufficient balance
        if (
            error.message.includes('insufficient funds') ||
            error.message.includes('exceeds balance')
        ) {
            return {
                type: ContractErrorType.INSUFFICIENT_BALANCE,
                message: 'Insufficient balance for this transaction.',
                details: error
            };
        }

        // Unauthorized actions
        if (error.message.includes('not owner') || error.message.includes('not authorized')) {
            return {
                type: ContractErrorType.UNAUTHORIZED,
                message: 'You are not authorized to perform this action.',
                details: error
            };
        }

        // Invalid parameters
        if (error.message.includes('invalid') || error.message.includes('wrong')) {
            return {
                type: ContractErrorType.INVALID_PARAMETERS,
                message: 'Invalid parameters provided for the transaction.',
                details: error
            };
        }
    }

    // Default contract error
    return {
        type: ContractErrorType.CONTRACT_ERROR,
        message: 'An error occurred while processing the transaction.',
        details: error
    };
}

export function validateAmount(amount: bigint): void {
    if (!amount || amount <= 0n) {
        throw {
            type: ContractErrorType.INVALID_PARAMETERS,
            message: 'Amount must be greater than 0'
        };
    }
}

export function validateAddress(address: string): void {
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw {
            type: ContractErrorType.INVALID_PARAMETERS,
            message: 'Invalid address format'
        };
    }
} 