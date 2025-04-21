import { ethers, Contract, Signer } from 'ethers';
import type { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { NETWORK_CONFIG, getContractAddress } from '../config/networks';
import IMorpheusBuilderABI from '../contracts/abis/IMorpheusBuilder.json';
import IMorpheusTreasuryABI from '../contracts/abis/IMorpheusTreasury.json';

export class ContractService {
    private provider: JsonRpcProvider;
    private signer: Signer;

    constructor(provider: JsonRpcProvider) {
        this.provider = provider;
        this.signer = provider.getSigner();
    }

    async getBuilderContract(networkId: number) {
        const address = getContractAddress(networkId, 'builders');
        return new Contract(address, IMorpheusBuilderABI, this.signer);
    }

    async getTreasuryContract(networkId: number) {
        const address = getContractAddress(networkId, 'treasury');
        return new Contract(address, IMorpheusTreasuryABI, this.signer);
    }

    async createBuilderPool(
        networkId: number,
        name: string,
        initialStake: BigNumber,
        lockPeriod: number,
        rewardSplit: number
    ) {
        const contract = await this.getBuilderContract(networkId);
        return contract.createBuilderPool(name, initialStake, lockPeriod, rewardSplit);
    }

    async stake(networkId: number, builderId: string, amount: BigNumber) {
        const contract = await this.getBuilderContract(networkId);
        return contract.stake(builderId, amount);
    }

    async unstake(networkId: number, builderId: string, amount: BigNumber) {
        const contract = await this.getBuilderContract(networkId);
        return contract.unstake(builderId, amount);
    }

    async claimRewards(networkId: number, builderId: string) {
        const contract = await this.getBuilderContract(networkId);
        return contract.claimRewards(builderId);
    }

    async getBuilderInfo(networkId: number, builderId: string) {
        const contract = await this.getBuilderContract(networkId);
        return contract.getBuilderInfo(builderId);
    }

    async getBuilderRewards(networkId: number, builderId: string) {
        const contract = await this.getTreasuryContract(networkId);
        return contract.getBuilderRewards(builderId);
    }
} 