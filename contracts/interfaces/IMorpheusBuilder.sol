// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMorpheusBuilder {
    /// @dev Struct to hold builder pool information
    struct BuilderPool {
        string name;
        address owner;
        uint256 totalStaked;
        uint256 totalVirtualStaked;
        uint256 rewardSplit;
        uint256 lockPeriod;
        uint256 lastRewardClaim;
        bool isActive;
    }

    /// @dev Struct for staking information
    struct StakeInfo {
        uint256 amount;
        uint256 virtualAmount;
        uint256 lockStart;
        uint256 lockEnd;
        bool isLocked;
    }

    /// @dev Events
    event BuilderPoolCreated(bytes32 indexed poolId, string name, address indexed owner);
    event Staked(bytes32 indexed poolId, address indexed staker, uint256 amount, uint256 virtualAmount);
    event Unstaked(bytes32 indexed poolId, address indexed staker, uint256 amount);
    event RewardsClaimed(bytes32 indexed poolId, address indexed staker, uint256 amount);
    event PoolUpdated(bytes32 indexed poolId, string name, uint256 rewardSplit);

    /// @dev Core functions
    function createBuilderPool(
        string memory name,
        uint256 initialStake,
        uint256 lockPeriod,
        uint256 rewardSplit
    ) external returns (bytes32);

    function stake(bytes32 builderId, uint256 amount) external;
    function unstake(bytes32 builderId, uint256 amount) external;
    function claimRewards(bytes32 builderId) external;
    function getBuilderInfo(bytes32 builderId) external view returns (
        string memory name,
        uint256 totalStaked,
        uint256 lockPeriod,
        uint256 rewardSplit
    );

    /// @dev View functions
    function getPoolInfo(bytes32 poolId) external view returns (BuilderPool memory);
    
    function getStakeInfo(bytes32 poolId, address staker) external view returns (StakeInfo memory);
    
    function getPoolId(string memory name) external view returns (bytes32);
    
    function getTotalStaked(bytes32 poolId) external view returns (uint256);
    
    function getTotalVirtualStaked(bytes32 poolId) external view returns (uint256);
    
    function getPendingRewards(bytes32 poolId, address staker) external view returns (uint256);

    /// @dev Administrative functions
    function updatePool(
        bytes32 poolId,
        string memory name,
        uint256 rewardSplit
    ) external;
    
    function setLockPeriod(bytes32 poolId, uint256 newLockPeriod) external;
    
    function pausePool(bytes32 poolId) external;
    
    function unpausePool(bytes32 poolId) external;

    /// @dev Treasury functions
    function setTreasury(address treasury) external;
    
    function setFeeConfig(address feeConfig) external;
    
    function withdrawEmergency(bytes32 poolId) external;
}