// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMOR is IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function pause() external;
    function unpause() external;
    function addToWhitelist(address account) external;
    function removeFromWhitelist(address account) external;
    function isWhitelisted(address account) external view returns (bool);
} 