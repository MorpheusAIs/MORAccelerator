// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuilder {
    struct BuilderPool {
        string name;
        address owner;
        uint256 totalStaked;
        uint256 rewardSplit;
        uint256 lockPeriod;
        uint256 lastRewardClaim;
        bool isActive;
    }

    event BuilderPoolCreated(bytes32 indexed poolId, string name, address indexed owner);
    event Staked(bytes32 indexed poolId, address indexed staker, uint256 amount);
    event Unstaked(bytes32 indexed poolId, address indexed staker, uint256 amount);
    event RewardsClaimed(bytes32 indexed poolId, address indexed staker, uint256 amount);

    function createBuilderPool(
        string memory name,
        uint256 initialStake,
        uint256 lockPeriod,
        uint256 rewardSplit
    ) external returns (bytes32);

    function stake(bytes32 poolId, uint256 amount) external;
    function unstake(bytes32 poolId, uint256 amount) external;
    function claimRewards(bytes32 poolId) external;
    function getBuilderPool(bytes32 poolId) external view returns (BuilderPool memory);
    function getStakerAmount(bytes32 poolId, address staker) external view returns (uint256);
    function getPendingRewards(bytes32 poolId, address staker) external view returns (uint256);
    function isLocked(bytes32 poolId, address staker) external view returns (bool);
    function getLockEndTime(bytes32 poolId, address staker) external view returns (uint256);
} 