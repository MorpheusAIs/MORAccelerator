// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PowerFactorCalculator
 * @dev Library for calculating power factors based on staking duration
 * Implements the Time & Dilution-Based Power Factor Method
 */
library PowerFactorCalculator {
    // Base multiplier (1.0) represented as 10000 for precision
    uint256 private constant BASE_MULTIPLIER = 10000;
    
    // Maximum power factor multiplier (3.0) represented as 30000
    uint256 private constant MAX_POWER_FACTOR = 30000;
    
    // Time thresholds for power factor calculation (in seconds)
    uint256 private constant ONE_MONTH = 30 days;
    uint256 private constant THREE_MONTHS = 90 days;
    uint256 private constant SIX_MONTHS = 180 days;
    uint256 private constant ONE_YEAR = 365 days;
    
    /**
     * @dev Calculate power factor based on staking duration
     * @param stakingDuration Duration of staking in seconds
     * @return Power factor multiplier (scaled by BASE_MULTIPLIER)
     *
     * Power Factor Scale:
     * - 0-1 month: 1.0x (base)
     * - 1-3 months: 1.0x to 1.5x (linear increase)
     * - 3-6 months: 1.5x to 2.0x (linear increase)
     * - 6-12 months: 2.0x to 2.5x (linear increase)
     * - 12+ months: 2.5x to 3.0x (diminishing returns)
     */
    function calculatePowerFactor(uint256 stakingDuration) internal pure returns (uint256) {
        // Base power factor (1.0x)
        if (stakingDuration < ONE_MONTH) {
            return BASE_MULTIPLIER;
        }
        
        // 1-3 months: 1.0x to 1.5x (linear increase)
        if (stakingDuration < THREE_MONTHS) {
            uint256 additionalFactor = ((stakingDuration - ONE_MONTH) * 5000) / (THREE_MONTHS - ONE_MONTH);
            return BASE_MULTIPLIER + additionalFactor;
        }
        
        // 3-6 months: 1.5x to 2.0x (linear increase)
        if (stakingDuration < SIX_MONTHS) {
            uint256 additionalFactor = 5000 + ((stakingDuration - THREE_MONTHS) * 5000) / (SIX_MONTHS - THREE_MONTHS);
            return BASE_MULTIPLIER + additionalFactor;
        }
        
        // 6-12 months: 2.0x to 2.5x (linear increase)
        if (stakingDuration < ONE_YEAR) {
            uint256 additionalFactor = 10000 + ((stakingDuration - SIX_MONTHS) * 5000) / (ONE_YEAR - SIX_MONTHS);
            return BASE_MULTIPLIER + additionalFactor;
        }
        
        // 12+ months: 2.5x to 3.0x (diminishing returns)
        uint256 additionalMonths = (stakingDuration - ONE_YEAR) / 30 days;
        
        // Cap at 24 additional months for max power factor
        if (additionalMonths > 24) {
            additionalMonths = 24;
        }
        
        uint256 additionalFactor = 15000 + (additionalMonths * 5000) / 24;
        
        // Cap at maximum power factor
        if (BASE_MULTIPLIER + additionalFactor > MAX_POWER_FACTOR) {
            return MAX_POWER_FACTOR;
        }
        
        return BASE_MULTIPLIER + additionalFactor;
    }
    
    /**
     * @dev Calculate virtual staked amount based on actual amount and power factor
     * @param stakedAmount Actual staked amount
     * @param stakingDuration Duration of staking in seconds
     * @return Virtual staked amount after applying power factor
     */
    function calculateVirtualStakedAmount(uint256 stakedAmount, uint256 stakingDuration) internal pure returns (uint256) {
        uint256 powerFactor = calculatePowerFactor(stakingDuration);
        return (stakedAmount * powerFactor) / BASE_MULTIPLIER;
    }
    
    /**
     * @dev Calculate rewards based on staked amount and power factor
     * @param stakedAmount Actual staked amount
     * @param stakingDuration Duration of staking in seconds
     * @param rewardRate Reward rate per token
     * @return Calculated rewards
     */
    function calculateRewards(uint256 stakedAmount, uint256 stakingDuration, uint256 rewardRate) internal pure returns (uint256) {
        uint256 virtualStakedAmount = calculateVirtualStakedAmount(stakedAmount, stakingDuration);
        return (virtualStakedAmount * rewardRate) / BASE_MULTIPLIER;
    }
}
