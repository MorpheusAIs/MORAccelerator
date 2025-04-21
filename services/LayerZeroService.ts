import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract, parseEther } from 'viem';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';

export interface CrossChainMessage {
    srcChainId: number;
    dstChainId: number;
    message: string;
    payload: string;
}

export interface LayerZeroConfig {
    endpoint: Address;
    gasLimit: bigint;
    adapterParams: `0x${string}`;
}

export class LayerZeroService {
    private static readonly LZ_ENDPOINTS: Record<(typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS], Address> = {
        [SUPPORTED_CHAINS.ARBITRUM]: '0x3c2269811836af69497E5F486A85D7316753cf62',
        [SUPPORTED_CHAINS.BASE]: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7'
    } as const;

    private static readonly DEFAULT_GAS_LIMIT = 200000n;
    private static readonly DEFAULT_ADAPTER_PARAMS = '0x';

    public static getLZEndpoint(chainId: (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS]): Address {
        return this.LZ_ENDPOINTS[chainId];
    }

    public static async estimateFees(
        contract: GetContractReturnType<any, PublicClient>,
        dstChainId: number,
        payload: `0x${string}`,
        useZro: boolean = false
    ): Promise<bigint> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const [nativeFee] = await contract.read.estimateSendFee([
            dstChainId,
            payload,
            useZro,
            adapterParams
        ]);
        return nativeFee;
    }

    public static getAdapterParams(gasLimit: bigint): `0x${string}` {
        // Version 1 adapter params encoding
        return `0x00${gasLimit.toString(16).padStart(8, '0')}` as `0x${string}`;
    }

    public static async sendCrossChainMessage(
        contract: GetContractReturnType<any, WalletClient>,
        dstChainId: number,
        payload: `0x${string}`,
        fees: bigint
    ): Promise<Hash> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const { request } = await contract.simulate.send([
            dstChainId,
            payload,
            false, // use Zro
            adapterParams
        ], { value: fees });
        
        return contract.write(request);
    }

    public static async getMessageStatus(
        contract: GetContractReturnType<any, PublicClient>,
        srcChainId: number,
        dstChainId: number,
        nonce: bigint
    ): Promise<boolean> {
        return contract.read.messageStatus([srcChainId, dstChainId, nonce]);
    }

    public static async retryMessage(
        contract: GetContractReturnType<any, WalletClient>,
        srcChainId: number,
        dstChainId: number,
        payload: `0x${string}`,
        fees: bigint
    ): Promise<Hash> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const { request } = await contract.simulate.retryMessage([
            srcChainId,
            dstChainId,
            payload,
            { value: fees },
            adapterParams
        ]);
        
        return contract.write(request);
    }

    public static getExplorerLink(chainId: number, txHash: Hash): string {
        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        return network ? `${network.explorer}/tx/${txHash}` : '#';
    }
} 