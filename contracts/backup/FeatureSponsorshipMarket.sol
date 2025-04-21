// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FeatureSponsorshipMarket is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    IERC20 public morToken;
    
    struct Milestone {
        string description;
        uint256 amount;
        bool isCompleted;
        bool isPaid;
    }

    struct Proposal {
        address sponsor;
        string title;
        string description;
        string requirements;
        uint256 totalBudget;
        uint256 stakedAmount;
        uint256 deadline;
        address selectedDeveloper;
        bool isActive;
        bool isCompleted;
        mapping(uint256 => Milestone) milestones;
        uint256 milestonesCount;
        mapping(address => Bid) bids;
        address[] bidders;
    }

    struct Bid {
        address developer;
        uint256 amount;
        string proposal;
        uint256 timeEstimate;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Minimum stake required to create a proposal (in MOR tokens)
    uint256 public minimumStake;
    
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed sponsor, string title, uint256 budget);
    event BidSubmitted(uint256 indexed proposalId, address indexed developer, uint256 amount);
    event DeveloperSelected(uint256 indexed proposalId, address indexed developer);
    event MilestoneCompleted(uint256 indexed proposalId, uint256 milestoneIndex);
    event MilestonePaid(uint256 indexed proposalId, uint256 milestoneIndex, address developer, uint256 amount);

    function initialize(address _morToken) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        
        morToken = IERC20(_morToken);
        minimumStake = 1000 * 10**18; // 1000 MOR tokens
        platformFee = 250; // 2.5%
    }

    function createProposal(
        string memory _title,
        string memory _description,
        string memory _requirements,
        uint256 _totalBudget,
        uint256 _deadline,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts
    ) external nonReentrant whenNotPaused {
        require(_milestoneDescriptions.length == _milestoneAmounts.length, "Milestone arrays length mismatch");
        require(_milestoneDescriptions.length > 0, "No milestones provided");
        require(_deadline > block.timestamp, "Invalid deadline");
        
        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            totalMilestoneAmount += _milestoneAmounts[i];
        }
        require(totalMilestoneAmount == _totalBudget, "Milestone amounts must equal total budget");
        
        // Transfer MOR tokens for staking
        require(morToken.transferFrom(msg.sender, address(this), minimumStake), "Stake transfer failed");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.sponsor = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.requirements = _requirements;
        proposal.totalBudget = _totalBudget;
        proposal.stakedAmount = minimumStake;
        proposal.deadline = _deadline;
        proposal.isActive = true;
        
        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            proposal.milestones[i] = Milestone({
                description: _milestoneDescriptions[i],
                amount: _milestoneAmounts[i],
                isCompleted: false,
                isPaid: false
            });
        }
        proposal.milestonesCount = _milestoneDescriptions.length;
        
        emit ProposalCreated(proposalId, msg.sender, _title, _totalBudget);
    }

    function submitBid(
        uint256 _proposalId,
        uint256 _amount,
        string memory _proposal,
        uint256 _timeEstimate
    ) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal is not active");
        require(block.timestamp < proposal.deadline, "Proposal deadline has passed");
        require(_amount <= proposal.totalBudget, "Bid amount exceeds budget");
        
        proposal.bids[msg.sender] = Bid({
            developer: msg.sender,
            amount: _amount,
            proposal: _proposal,
            timeEstimate: _timeEstimate,
            exists: true
        });
        proposal.bidders.push(msg.sender);
        
        emit BidSubmitted(_proposalId, msg.sender, _amount);
    }

    function selectDeveloper(uint256 _proposalId, address _developer) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(msg.sender == proposal.sponsor, "Only sponsor can select developer");
        require(proposal.isActive, "Proposal is not active");
        require(proposal.bids[_developer].exists, "Developer has not submitted a bid");
        
        proposal.selectedDeveloper = _developer;
        emit DeveloperSelected(_proposalId, _developer);
    }

    function completeMilestone(uint256 _proposalId, uint256 _milestoneIndex) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(msg.sender == proposal.sponsor, "Only sponsor can complete milestone");
        require(_milestoneIndex < proposal.milestonesCount, "Invalid milestone index");
        require(!proposal.milestones[_milestoneIndex].isCompleted, "Milestone already completed");
        
        Milestone storage milestone = proposal.milestones[_milestoneIndex];
        milestone.isCompleted = true;
        
        uint256 paymentAmount = milestone.amount;
        uint256 fee = (paymentAmount * platformFee) / 10000;
        uint256 developerPayment = paymentAmount - fee;
        
        require(morToken.transfer(proposal.selectedDeveloper, developerPayment), "Developer payment failed");
        require(morToken.transfer(owner(), fee), "Fee payment failed");
        
        milestone.isPaid = true;
        
        emit MilestoneCompleted(_proposalId, _milestoneIndex);
        emit MilestonePaid(_proposalId, _milestoneIndex, proposal.selectedDeveloper, developerPayment);
        
        // Check if all milestones are completed
        bool allCompleted = true;
        for (uint256 i = 0; i < proposal.milestonesCount; i++) {
            if (!proposal.milestones[i].isCompleted) {
                allCompleted = false;
                break;
            }
        }
        
        if (allCompleted) {
            proposal.isCompleted = true;
            proposal.isActive = false;
            // Return staked tokens to sponsor
            require(morToken.transfer(proposal.sponsor, proposal.stakedAmount), "Stake return failed");
        }
    }

    // Admin functions
    function setMinimumStake(uint256 _newMinimumStake) external onlyOwner {
        minimumStake = _newMinimumStake;
    }
    
    function setPlatformFee(uint256 _newPlatformFee) external onlyOwner {
        require(_newPlatformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newPlatformFee;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}