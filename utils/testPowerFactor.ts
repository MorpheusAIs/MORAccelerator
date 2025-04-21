import { useCallback } from 'react';
import { POWER_FACTOR_CONFIG } from '../contracts/config/rewardDistribution';

/**
 * Test utility for validating power factor calculations
 * This helps ensure the power factor implementation works correctly
 */
export function testPowerFactorCalculation() {
  const { BASE_MULTIPLIER, MAX_POWER_FACTOR, TIME_THRESHOLDS, TIERS } = POWER_FACTOR_CONFIG;
  
  // Test cases for different staking durations
  const testCases = [
    { duration: 0, expectedFactor: 1.0, description: "Zero duration" },
    { duration: 15 * 24 * 60 * 60, expectedFactor: 1.0, description: "15 days (< 1 month)" },
    { duration: TIME_THRESHOLDS.ONE_MONTH, expectedFactor: 1.0, description: "Exactly 1 month" },
    { duration: TIME_THRESHOLDS.ONE_MONTH + 1, expectedFactor: 1.0 + 0.5 * (1/60), description: "Just over 1 month" },
    { duration: TIME_THRESHOLDS.THREE_MONTHS - 1, expectedFactor: 1.5 - 0.5 * (1/60), description: "Just under 3 months" },
    { duration: TIME_THRESHOLDS.THREE_MONTHS, expectedFactor: 1.5, description: "Exactly 3 months" },
    { duration: TIME_THRESHOLDS.SIX_MONTHS, expectedFactor: 2.0, description: "Exactly 6 months" },
    { duration: TIME_THRESHOLDS.ONE_YEAR, expectedFactor: 2.5, description: "Exactly 1 year" },
    { duration: TIME_THRESHOLDS.ONE_YEAR + (12 * 30 * 24 * 60 * 60), expectedFactor: 2.75, description: "1.5 years" },
    { duration: TIME_THRESHOLDS.ONE_YEAR + (24 * 30 * 24 * 60 * 60), expectedFactor: 3.0, description: "2 years" },
    { duration: TIME_THRESHOLDS.ONE_YEAR + (36 * 30 * 24 * 60 * 60), expectedFactor: 3.0, description: "3 years (max cap)" },
  ];
  
  // Calculate power factor based on staking duration
  const calculatePowerFactor = (stakingDuration: number): number => {
    // Base power factor (1.0x)
    if (stakingDuration < TIME_THRESHOLDS.ONE_MONTH) {
      return 1.0;
    }
    
    // 1-3 months: 1.0x to 1.5x (linear increase)
    if (stakingDuration < TIME_THRESHOLDS.THREE_MONTHS) {
      const additionalFactor = ((stakingDuration - TIME_THRESHOLDS.ONE_MONTH) * 0.5) / 
                              (TIME_THRESHOLDS.THREE_MONTHS - TIME_THRESHOLDS.ONE_MONTH);
      return 1.0 + additionalFactor;
    }
    
    // 3-6 months: 1.5x to 2.0x (linear increase)
    if (stakingDuration < TIME_THRESHOLDS.SIX_MONTHS) {
      const additionalFactor = 0.5 + ((stakingDuration - TIME_THRESHOLDS.THREE_MONTHS) * 0.5) / 
                              (TIME_THRESHOLDS.SIX_MONTHS - TIME_THRESHOLDS.THREE_MONTHS);
      return 1.0 + additionalFactor;
    }
    
    // 6-12 months: 2.0x to 2.5x (linear increase)
    if (stakingDuration < TIME_THRESHOLDS.ONE_YEAR) {
      const additionalFactor = 1.0 + ((stakingDuration - TIME_THRESHOLDS.SIX_MONTHS) * 0.5) / 
                              (TIME_THRESHOLDS.ONE_YEAR - TIME_THRESHOLDS.SIX_MONTHS);
      return 1.0 + additionalFactor;
    }
    
    // 12+ months: 2.5x to 3.0x (diminishing returns)
    const additionalMonths = Math.floor((stakingDuration - TIME_THRESHOLDS.ONE_YEAR) / (30 * 24 * 60 * 60));
    
    // Cap at 24 additional months for max power factor
    const cappedAdditionalMonths = Math.min(additionalMonths, 24);
    
    const additionalFactor = 1.5 + (cappedAdditionalMonths * 0.5) / 24;
    
    // Cap at maximum power factor
    return Math.min(1.0 + additionalFactor, 3.0);
  };
  
  // Run tests and return results
  const runTests = () => {
    const results = testCases.map(testCase => {
      const calculatedFactor = calculatePowerFactor(testCase.duration);
      const passed = Math.abs(calculatedFactor - testCase.expectedFactor) < 0.01; // Allow small floating point differences
      
      return {
        ...testCase,
        calculatedFactor,
        passed
      };
    });
    
    const allPassed = results.every(result => result.passed);
    
    return {
      results,
      allPassed,
      summary: `${results.filter(r => r.passed).length}/${results.length} tests passed`
    };
  };
  
  // Calculate rewards based on staked amount and power factor
  const calculateRewards = (stakedAmount: bigint, stakingDuration: number, rewardRate: bigint): bigint => {
    const powerFactor = calculatePowerFactor(stakingDuration);
    const powerFactorScaled = BigInt(Math.floor(powerFactor * BASE_MULTIPLIER));
    const virtualStakedAmount = (stakedAmount * powerFactorScaled) / BigInt(BASE_MULTIPLIER);
    return (virtualStakedAmount * rewardRate) / BigInt(BASE_MULTIPLIER);
  };
  
  // Test reward calculations
  const testRewardCalculations = () => {
    const stakedAmount = BigInt(1000000000000000000000); // 1000 tokens
    const rewardRate = BigInt(100); // 1% reward rate
    
    const rewardResults = testCases.map(testCase => {
      const powerFactor = calculatePowerFactor(testCase.duration);
      const rewards = calculateRewards(stakedAmount, testCase.duration, rewardRate);
      
      return {
        duration: testCase.duration,
        description: testCase.description,
        powerFactor,
        rewards,
        expectedRewards: BigInt(Math.floor(Number(stakedAmount) * powerFactor * Number(rewardRate) / BASE_MULTIPLIER))
      };
    });
    
    return rewardResults;
  };
  
  return {
    runTests,
    testRewardCalculations,
    calculatePowerFactor
  };
}
