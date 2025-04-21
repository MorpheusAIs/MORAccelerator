// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FeatureRequests.sol";
import "./DeveloperRegistry.sol";

contract Bidding is Ownable {
    FeatureRequests public featureRequests;
    DeveloperRegistry public developerRegistry;

    struct Bid {
        address developer;
        uint256 amount;
        uint256 timeEstimate;
        bool isSelected;
    }

    mapping(uint256 => Bid[]) public bids; // featureRequestId => Bid[]
    mapping(uint256 => bool) public isBiddingOpen; // featureRequestId => isBiddingOpen

    event BidSubmitted(uint256 indexed featureRequestId, address indexed developer, uint256 amount, uint256 timeEstimate);
    event BidSelected(uint256 indexed featureRequestId, address indexed developer);
    event BiddingClosed(uint256 indexed featureRequestId);

    constructor(address _featureRequestsAddress, address _developerRegistryAddress) {
        featureRequests = FeatureRequests(_featureRequestsAddress);
        developerRegistry = DeveloperRegistry(_developerRegistryAddress);
    }

    function submitBid(uint256 _featureRequestId, uint256 _amount, uint256 _timeEstimate) external {
        require(isBiddingOpen[_featureRequestId], "Bidding is not open for this feature request");
        require(developerRegistry.isDeveloperRegistered(msg.sender), "Only registered developers can bid");

        bids[_featureRequestId].push(Bid({
            developer: msg.sender,
            amount: _amount,
            timeEstimate: _timeEstimate,
            isSelected: false
        }));

        emit BidSubmitted(_featureRequestId, msg.sender, _amount, _timeEstimate);
    }

    function openBidding(uint256 _featureRequestId) external onlyOwner {
        require(!isBiddingOpen[_featureRequestId], "Bidding is already open for this feature request");
        isBiddingOpen[_featureRequestId] = true;
    }

    function closeBidding(uint256 _featureRequestId) external onlyOwner {
        require(isBiddingOpen[_featureRequestId], "Bidding is not open for this feature request");
        isBiddingOpen[_featureRequestId] = false;
        emit BiddingClosed(_featureRequestId);
    }

    function selectBid(uint256 _featureRequestId, uint256 _bidIndex) external onlyOwner {
        require(!isBiddingOpen[_featureRequestId], "Bidding must be closed before selecting a bid");
        require(_bidIndex < bids[_featureRequestId].length, "Invalid bid index");

        Bid storage selectedBid = bids[_featureRequestId][_bidIndex];
        require(!selectedBid.isSelected, "This bid is already selected");

        selectedBid.isSelected = true;
        emit BidSelected(_featureRequestId, selectedBid.developer);
    }

    function getBidsForFeatureRequest(uint256 _featureRequestId) external view returns (Bid[] memory) {
        return bids[_featureRequestId];
    }
}