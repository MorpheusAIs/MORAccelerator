import { useCallback, useState } from 'react';
import { type Address, type Hash, encodePacked, parseEther } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { LayerZeroService, type CrossChainMessage } from '../services/LayerZeroService';
import { handleContractError } from '../utils/contractErrors';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';

interface CrossChainState {
    isLoading: boolean;
    error: string | null;
    txHash: Hash | null;
    estimatedFees: bigint | null;
}

export function useCrossChain() {
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [state, setState] = useState<CrossChainState>({
        isLoading: false,
        error: null,
        txHash: null,
        estimatedFees: null
    });

    const resetState = useCallback(() => {
        setState({
            isLoading: false,
            error: null,
            txHash: null,
            estimatedFees: null
        });
    }, []);

    const estimateFees = useCallback(async (
        message: CrossChainMessage,
        contract: any
    ) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            
            const payload = encodePacked(
                ['string', 'address'],
                [message.message, message.payload as Address]
            );

            const fees = await LayerZeroService.estimateFees(
                contract,
                message.dstChainId,
                payload,
                false
            );

            setState(prev => ({ ...prev, estimatedFees: fees }));
            return fees;
        } catch (error) {
            const contractError = handleContractError(error);
            setState(prev => ({ ...prev, error: contractError.message }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const sendMessage = useCallback(async (
        message: CrossChainMessage,
        contract: any
    ) => {
        if (!walletClient) {
            throw new Error('Wallet not connected');
        }

        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const payload = encodePacked(
                ['string', 'address'],
                [message.message, message.payload as Address]
            );

            let fees = state.estimatedFees;
            if (!fees) {
                fees = await estimateFees(message, contract);
            }

            const txHash = await LayerZeroService.sendCrossChainMessage(
                contract,
                message.dstChainId,
                payload,
                fees
            );

            setState(prev => ({ ...prev, txHash }));
            return txHash;
        } catch (error) {
            const contractError = handleContractError(error);
            setState(prev => ({ ...prev, error: contractError.message }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [walletClient, state.estimatedFees, estimateFees]);

    const getMessageStatus = useCallback(async (
        message: CrossChainMessage,
        contract: any,
        nonce: bigint
    ): Promise<boolean> => {
        try {
            return await LayerZeroService.getMessageStatus(
                contract,
                message.srcChainId,
                message.dstChainId,
                nonce
            );
        } catch (error) {
            const contractError = handleContractError(error);
            setState(prev => ({ ...prev, error: contractError.message }));
            throw error;
        }
    }, []);

    const retryMessage = useCallback(async (
        message: CrossChainMessage,
        contract: any,
        payload: `0x${string}`,
        fees: bigint
    ): Promise<Hash> => {
        if (!walletClient) {
            throw new Error('Wallet not connected');
        }

        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const txHash = await LayerZeroService.retryMessage(
                contract,
                message.srcChainId,
                message.dstChainId,
                payload,
                fees
            );

            setState(prev => ({ ...prev, txHash }));
            return txHash;
        } catch (error) {
            const contractError = handleContractError(error);
            setState(prev => ({ ...prev, error: contractError.message }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [walletClient]);

    return {
        ...state,
        estimateFees,
        sendMessage,
        getMessageStatus,
        retryMessage,
        resetState
    };
} 