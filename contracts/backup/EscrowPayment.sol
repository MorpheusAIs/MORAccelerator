// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeatureRequests.sol";
import "./Bidding.sol";

contract EscrowPayment is Ownable {
    IERC20 public morToken;
    FeatureRequests public featureRequests;
    Bidding public bidding;

    struct Escrow {
        address developer;
        address sponsor;
        uint256 totalAmount;
        uint256 releasedAmount;
        uint8 totalMilestones;
        uint8 completedMilestones;
        bool isActive;
    }

    mapping(uint256 => Escrow) public escrows; // featureRequestId => Escrow

    event EscrowCreated(uint256 indexed featureRequestId, address developer, address sponsor, uint256 totalAmount, uint8 totalMilestones);
    event MilestoneCompleted(uint256 indexed featureRequestId, uint8 milestoneNumber, uint256 amountReleased);
    event EscrowClosed(uint256 indexed featureRequestId);

    constructor(address _morTokenAddress, address _featureRequestsAddress, address _biddingAddress) {
        morToken = IERC20(_morTokenAddress);
        featureRequests = FeatureRequests(_featureRequestsAddress);
        bidding = Bidding(_biddingAddress);
    }

    function createEscrow(uint256 _featureRequestId) external onlyOwner {
        require(!escrows[_featureRequestId].isActive, "Escrow already exists for this feature request");

        (address sponsor, , , uint256 morAmount, uint8 milestones, bool isActive) = featureRequests.getFeatureRequest(_featureRequestId);
        require(isActive, "Feature request is not active");

        Bidding.Bid[] memory bids = bidding.getBidsForFeatureRequest(_featureRequestId);
        require(bids.length > 0, "No bids for this feature request");

        address selectedDeveloper;
        uint256 selectedBidAmount;
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].isSelected) {
                selectedDeveloper = bids[i].developer;
                selectedBidAmount = bids[i].amount;
                break;
            }
        }
        require(selectedDeveloper != address(0), "No selected bid found");

        escrows[_featureRequestId] = Escrow({
            developer: selectedDeveloper,
            sponsor: sponsor,
            totalAmount: selectedBidAmount,
            releasedAmount: 0,
            totalMilestones: milestones,
            completedMilestones: 0,
            isActive: true
        });

        require(morToken.transferFrom(sponsor, address(this), selectedBidAmount), "Failed to transfer MOR tokens to escrow");

        emit EscrowCreated(_featureRequestId, selectedDeveloper, sponsor, selectedBidAmount, milestones);
    }

    function completeMilestone(uint256 _featureRequestId) external onlyOwner {
        Escrow storage escrow = escrows[_featureRequestId];
        require(escrow.isActive, "Escrow is not active");
        require(escrow.completedMilestones < escrow.totalMilestones, "All milestones already completed");

        uint256 amountToRelease = escrow.totalAmount / escrow.totalMilestones;
        escrow.completedMilestones++;
        escrow.releasedAmount += amountToRelease;

        require(morToken.transfer(escrow.developer, amountToRelease), "Failed to transfer MOR tokens to developer");

        emit MilestoneCompleted(_featureRequestId, escrow.completedMilestones, amountToRelease);

        if (escrow.completedMilestones == escrow.totalMilestones) {
            escrow.isActive = false;
            emit EscrowClosed(_featureRequestId);
        }
    }

    function getEscrowDetails(uint256 _featureRequestId) external view returns (Escrow memory) {
        return escrows[_featureRequestId];
    }

    function emergencyWithdraw(uint256 _featureRequestId) external onlyOwner {
        Escrow storage escrow = escrows[_featureRequestId];
        require(escrow.isActive, "Escrow is not active");

        uint256 remainingAmount = escrow.totalAmount - escrow.releasedAmount;
        require(morToken.transfer(escrow.sponsor, remainingAmount), "Failed to return MOR tokens to sponsor");

        escrow.isActive = false;
        emit EscrowClosed(_featureRequestId);
    }
}