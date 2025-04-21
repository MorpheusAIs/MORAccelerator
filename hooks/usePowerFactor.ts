import { useCallback, useMemo } from 'react';

/**
 * Hook for calculating power factors based on staking duration
 * Implements the Time & Dilution-Based Power Factor Method
 */
export function usePowerFactor() {
  // Constants for power factor calculation
  const BASE_MULTIPLIER = 10000;
  const MAX_POWER_FACTOR = 30000;
  
  // Time thresholds in seconds
  const ONE_MONTH = 30 * 24 * 60 * 60;
  const THREE_MONTHS = 90 * 24 * 60 * 60;
  const SIX_MONTHS = 180 * 24 * 60 * 60;
  const ONE_YEAR = 365 * 24 * 60 * 60;

  /**
   * Calculate power factor based on staking duration
   * @param stakingDuration Duration of staking in seconds
   * @returns Power factor as a decimal (e.g., 1.5 for 1.5x)
   */
  const calculatePowerFactor = useCallback((stakingDuration: number): number => {
    // Base power factor (1.0x)
    if (stakingDuration < ONE_MONTH) {
      return 1.0;
    }
    
    // 1-3 months: 1.0x to 1.5x (linear increase)
    if (stakingDuration < THREE_MONTHS) {
      const additionalFactor = ((stakingDuration - ONE_MONTH) * 0.5) / (THREE_MONTHS - ONE_MONTH);
      return 1.0 + additionalFactor;
    }
    
    // 3-6 months: 1.5x to 2.0x (linear increase)
    if (stakingDuration < SIX_MONTHS) {
      const additionalFactor = 0.5 + ((stakingDuration - THREE_MONTHS) * 0.5) / (SIX_MONTHS - THREE_MONTHS);
      return 1.0 + additionalFactor;
    }
    
    // 6-12 months: 2.0x to 2.5x (linear increase)
    if (stakingDuration < ONE_YEAR) {
      const additionalFactor = 1.0 + ((stakingDuration - SIX_MONTHS) * 0.5) / (ONE_YEAR - SIX_MONTHS);
      return 1.0 + additionalFactor;
    }
    
    // 12+ months: 2.5x to 3.0x (diminishing returns)
    const additionalMonths = Math.floor((stakingDuration - ONE_YEAR) / (30 * 24 * 60 * 60));
    
    // Cap at 24 additional months for max power factor
    const cappedAdditionalMonths = Math.min(additionalMonths, 24);
    
    const additionalFactor = 1.5 + (cappedAdditionalMonths * 0.5) / 24;
    
    // Cap at maximum power factor
    return Math.min(1.0 + additionalFactor, 3.0);
  }, []);

  /**
   * Calculate virtual staked amount based on actual amount and power factor
   * @param stakedAmount Actual staked amount (in wei/bigint)
   * @param stakingDuration Duration of staking in seconds
   * @returns Virtual staked amount after applying power factor
   */
  const calculateVirtualStakedAmount = useCallback((stakedAmount: bigint, stakingDuration: number): bigint => {
    const powerFactor = calculatePowerFactor(stakingDuration);
    const powerFactorScaled = BigInt(Math.floor(powerFactor * BASE_MULTIPLIER));
    return (stakedAmount * powerFactorScaled) / BigInt(BASE_MULTIPLIER);
  }, [calculatePowerFactor]);

  /**
   * Calculate rewards based on staked amount and power factor
   * @param stakedAmount Actual staked amount (in wei/bigint)
   * @param stakingDuration Duration of staking in seconds
   * @param rewardRate Reward rate per token
   * @returns Calculated rewards
   */
  const calculateRewards = useCallback((stakedAmount: bigint, stakingDuration: number, rewardRate: bigint): bigint => {
    const virtualStakedAmount = calculateVirtualStakedAmount(stakedAmount, stakingDuration);
    return (virtualStakedAmount * rewardRate) / BigInt(BASE_MULTIPLIER);
  }, [calculateVirtualStakedAmount]);

  /**
   * Get power factor tiers for display
   * @returns Array of power factor tiers with descriptions
   */
  const getPowerFactorTiers = useMemo(() => {
    return [
      { duration: '0-1 month', factor: '1.0x', description: 'Base staking power' },
      { duration: '1-3 months', factor: '1.0x-1.5x', description: 'Early loyalty boost' },
      { duration: '3-6 months', factor: '1.5x-2.0x', description: 'Medium-term commitment' },
      { duration: '6-12 months', factor: '2.0x-2.5x', description: 'Long-term commitment' },
      { duration: '12+ months', factor: '2.5x-3.0x', description: 'Maximum loyalty boost' }
    ];
  }, []);

  return {
    calculatePowerFactor,
    calculateVirtualStakedAmount,
    calculateRewards,
    getPowerFactorTiers
  };
}
