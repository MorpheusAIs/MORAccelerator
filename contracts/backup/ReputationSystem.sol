// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ReputationSystem is OwnableUpgradeable, UUPSUpgradeable {
    struct Reputation {
        uint256 score;
        uint256 totalProjects;
        uint256 successfulProjects;
    }

    mapping(address => Reputation) public reputations;

    event ReputationUpdated(address indexed user, uint256 newScore);

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function updateReputation(address _user, bool _successful) external onlyOwner {
        Reputation storage rep = reputations[_user];
        rep.totalProjects++;
        if (_successful) {
            rep.successfulProjects++;
        }

        // Simple reputation calculation: (successful projects / total projects) * 100
        rep.score = (rep.successfulProjects * 100) / rep.totalProjects;

        emit ReputationUpdated(_user, rep.score);
    }

    function getReputation(address _user) external view returns (uint256 score, uint256 totalProjects, uint256 successfulProjects) {
        Reputation storage rep = reputations[_user];
        return (rep.score, rep.totalProjects, rep.successfulProjects);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}