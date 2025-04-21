// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMorpheusFeeConfig {
    /// @dev Events
    event FeeUpdated(uint256 newFee);
    event FeeCollectorUpdated(address newCollector);
    event MinimumStakeUpdated(uint256 newMinimum);

    /// @dev Fee configuration
    function getFee() external view returns (uint256);
    
    function getFeeCollector() external view returns (address);
    
    function getMinimumStake() external view returns (uint256);

    /// @dev Administrative functions
    function setFee(uint256 newFee) external;
    
    function setFeeCollector(address newCollector) external;
    
    function setMinimumStake(uint256 newMinimum) external;

    /// @dev Validation functions
    function validateFee(uint256 amount) external view returns (uint256);
    
    function calculateFee(uint256 amount) external view returns (uint256);
}