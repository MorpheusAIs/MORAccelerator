// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDistribution {
    struct Interval {
        uint256 startTime;
        uint256 endTime;
        uint256 amount;
    }

    event IntervalUpdated(uint256 indexed intervalId, uint256 startTime, uint256 endTime, uint256 amount);
    event TokensClaimed(address indexed account, uint256 amount);
    event StakeUpdated(address indexed account, uint256 amount);

    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claimRewards() external;
    function getRewards(address account) external view returns (uint256);
    function getTotalStaked() external view returns (uint256);
    function getUserStake(address account) external view returns (uint256);
    function getCurrentInterval() external view returns (Interval memory);
    function getIntervalCount() external view returns (uint256);
    function getInterval(uint256 intervalId) external view returns (Interval memory);
} 