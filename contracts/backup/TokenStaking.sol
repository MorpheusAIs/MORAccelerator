// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract TokenStaking is UUPSUpgradeable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IERC20Upgradeable public morToken;

    struct Stake {
        uint256 amount;
        uint256 since;
        uint256 claimedRewards;
    }

    mapping(address => Stake) public stakes;
    
    uint256 public totalStaked;
    uint256 public rewardRate; // Reward per second per token staked
    uint256 public constant REWARD_PRECISION = 1e18;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    function initialize(address _morTokenAddress) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        morToken = IERC20Upgradeable(_morTokenAddress);
        rewardRate = 317097920; // Approximately 10% APY
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0");
        updateReward(msg.sender);
        
        morToken.safeTransferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount = stakes[msg.sender].amount.add(_amount);
        totalStaked = totalStaked.add(_amount);
        
        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0");
        require(stakes[msg.sender].amount >= _amount, "Not enough staked");
        
        updateReward(msg.sender);
        
        stakes[msg.sender].amount = stakes[msg.sender].amount.sub(_amount);
        totalStaked = totalStaked.sub(_amount);
        morToken.safeTransfer(msg.sender, _amount);
        
        emit Unstaked(msg.sender, _amount);
    }

    function claimReward() external {
        updateReward(msg.sender);
        uint256 reward = calculateReward(msg.sender);
        if (reward > 0) {
            stakes[msg.sender].claimedRewards = stakes[msg.sender].claimedRewards.add(reward);
            morToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function calculateReward(address _staker) public view returns (uint256) {
        uint256 stakedAmount = stakes[_staker].amount;
        if (stakedAmount == 0) {
            return 0;
        }
        uint256 stakedTime = block.timestamp.sub(stakes[_staker].since);
        return stakedAmount.mul(stakedTime).mul(rewardRate).div(REWARD_PRECISION);
    }

    function updateReward(address _staker) internal {
        if (_staker != address(0)) {
            stakes[_staker].claimedRewards = stakes[_staker].claimedRewards.add(calculateReward(_staker));
            stakes[_staker].since = block.timestamp;
        }
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}