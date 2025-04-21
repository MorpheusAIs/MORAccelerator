export * from './MorpheusBuilder';
// TODO: Add exports for Treasury and FeeConfig ABIs when created

export const NETWORK_CHAIN_IDS = {
    arbitrum: 42161,
    base: 8453
} as const;

export const NETWORK_PARAMETERS = {
    editPoolDeadline: 86400, // 24 hours in seconds
    withdrawLockPeriod: 604800, // 7 days in seconds
    feePercentage: 100, // 1% = 100 basis points
    minimumStake: "100000000000000000000" // 100 MOR
} as const; 