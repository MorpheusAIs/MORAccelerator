// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOFT {
    function estimateSendFee(uint16 _dstChainId, bytes calldata _toAddress, uint256 _amount, bool _useZro, bytes calldata _adapterParams) external view returns (uint256 nativeFee, uint256 zroFee);
    function sendFrom(address _from, uint16 _dstChainId, bytes calldata _toAddress, uint256 _amount, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams) external payable;
    function setMinDstGas(uint16 _dstChainId, uint16 _packetType, uint256 _minGas) external;
    function setUseCustomAdapterParams(bool _useCustomAdapterParams) external;
    function circulatingSupply() external view returns (uint256);
    function token() external view returns (address);
} 