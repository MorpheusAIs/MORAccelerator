import { useEffect, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { Web3Provider } from '@ethersproject/providers';
import { ContractService } from '../services/ContractService';

export function useContractService() {
    const provider = useProvider();
    const { data: signer } = useSigner();
    const [contractService, setContractService] = useState<ContractService | null>(null);

    useEffect(() => {
        if (!provider || !signer) return;
        
        const web3Provider = new Web3Provider(provider as any);
        const service = new ContractService(web3Provider);
        setContractService(service);
    }, [provider, signer]);

    return contractService;
} 