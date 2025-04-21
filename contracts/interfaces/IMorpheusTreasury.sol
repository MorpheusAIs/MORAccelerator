// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMorpheusTreasury {
    /// @dev Events
    event RewardsDistributed(bytes32[] poolIds, uint256[] amounts);
    event FeeCollected(bytes32 indexed poolId, uint256 amount);
    event TreasuryUpdated(address newTreasury);
    event FeeConfigUpdated(address newFeeConfig);

    /// @dev Core functions
    function distributeRewards(
        bytes32[] calldata builderIds,
        uint256[] calldata amounts
    ) external;

    function claimFees(bytes32 poolId) external returns (uint256);

    /// @dev View functions
    function getPendingFees(bytes32 poolId) external view returns (uint256);
    
    function getTotalDistributed() external view returns (uint256);
    
    function getFeePercentage() external view returns (uint256);

    /// @dev Administrative functions
    function setFeePercentage(uint256 newFeePercentage) external;
    
    function setFeeCollector(address newCollector) external;
    
    function withdrawEmergency(address token, uint256 amount) external;

    function getBuilderRewards(bytes32 builderId) external view returns (uint256);
}