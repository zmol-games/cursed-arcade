// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ZmolCredits} from "./ZmolCredits.sol";
import {ArcadePoints} from "./ArcadePoints.sol";

contract MadameZmoltra is Ownable, ReentrancyGuard {
    // ====== External contracts ======
    ZmolCredits public immutable i_zmolCredits;
    ArcadePoints public immutable i_arcadePoints;

    // ====== Fortunes ======
    string[] public fortunes;
    mapping(uint256 => uint256) public fortunePoints; // fortuneId => points awarded (0 if none)

    // ====== Credit Cost ======
    uint256 public creditsPerFortune = 1;

    // ====== Events ======
    event FortuneDrawn(address indexed player, string fortune, uint256 pointsAwarded);

    // ====== Constructor ======
    constructor(address zmolCreditsAddress, address arcadePointsAddress) Ownable(msg.sender) {
        i_zmolCredits = ZmolCredits(payable(zmolCreditsAddress));
        i_arcadePoints = ArcadePoints(arcadePointsAddress);
    }

    // ====== Core Functions ======

    function drawFortune() external nonReentrant {
        i_zmolCredits.spendCredit(msg.sender);

        uint256 randomSeed = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))
        );
        uint256 fortuneId = randomSeed % fortunes.length;

        _deliverFortune(msg.sender, fortuneId);
    }

    function _deliverFortune(address player, uint256 fortuneId) internal {
        uint256 points = fortunePoints[fortuneId];

        emit FortuneDrawn(player, fortunes[fortuneId], points);

        if (points > 0) {
            i_arcadePoints.addPoints(player, points);
        }
    }

    // ====== View Functions ======

    function getCredits(address player) external view returns (uint256) {
        return i_zmolCredits.getCredits(player);
    }

    function getPoints(address player) external view returns (uint256) {
        return i_arcadePoints.getPoints(player);
    }

    function getTotalFortunes() external view returns (uint256) {
        return fortunes.length;
    }

    // ====== Admin Functions ======

    function addFortune(string calldata fortuneText, uint256 points) external onlyOwner {
        fortunes.push(fortuneText);
        if (points > 0) {
            fortunePoints[fortunes.length - 1] = points;
        }
    }

    function setCreditsPerFortune(uint256 credits) external onlyOwner {
        creditsPerFortune = credits;
    }
}