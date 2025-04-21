export interface TokenConfig {
    address: string;
    decimals: number;
    symbol: string;
}

export interface ContractAddresses {
    builder: string;
    treasury: string;
    feeConfig: string;
}

export interface NetworkParams {
    editPoolDeadline: number;
    withdrawLockPeriod: number;
    feePercentage: number;
    minimumStake: string;
}

export interface NetworkConfig {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorer: string;
    contracts: ContractAddresses;
    params: NetworkParams;
    tokens: {
        MOR: TokenConfig;
        [key: string]: TokenConfig;
    };
}