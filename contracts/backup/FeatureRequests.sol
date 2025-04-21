// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FeatureRequests is Ownable {
    IERC20 public morToken;

    struct FeatureRequest {
        address sponsor;
        string title;
        string description;
        uint256 morAmount;
        uint8 milestones;
        bool isActive;
    }

    FeatureRequest[] public featureRequests;

    event FeatureRequestCreated(uint256 indexed id, address indexed sponsor, string title, uint256 morAmount);
    event FeatureRequestClosed(uint256 indexed id);

    constructor(address _morTokenAddress) {
        morToken = IERC20(_morTokenAddress);
    }

    function createFeatureRequest(string memory _title, string memory _description, uint256 _morAmount, uint8 _milestones) external {
        require(_milestones > 0 && _milestones <= 4, "Milestones must be between 1 and 4");
        require(_morAmount > 0, "MOR amount must be greater than 0");
        require(morToken.transferFrom(msg.sender, address(this), _morAmount), "Transfer failed");

        featureRequests.push(FeatureRequest({
            sponsor: msg.sender,
            title: _title,
            description: _description,
            morAmount: _morAmount,
            milestones: _milestones,
            isActive: true
        }));

        emit FeatureRequestCreated(featureRequests.length - 1, msg.sender, _title, _morAmount);
    }

    function closeFeatureRequest(uint256 _id) external onlyOwner {
        require(_id < featureRequests.length, "Invalid feature request ID");
        require(featureRequests[_id].isActive, "Feature request is not active");

        featureRequests[_id].isActive = false;
        emit FeatureRequestClosed(_id);
    }

    function getFeatureRequest(uint256 _id) external view returns (FeatureRequest memory) {
        require(_id < featureRequests.length, "Invalid feature request ID");
        return featureRequests[_id];
    }

    function getFeatureRequestsCount() external view returns (uint256) {
        return featureRequests.length;
    }
}