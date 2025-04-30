// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ZmolCredits} from "./ZmolCredits.sol";
import {ArcadePoints} from "./ArcadePoints.sol";

contract SlotMachine is Ownable, ReentrancyGuard {
    ArcadePoints public immutable i_arcadePoints;
    ZmolCredits public immutable i_zmolCredits;

    event SpinResult(address indexed player, uint8[3] result, bool win);
    event CreditUsed(address indexed player);
    event PointsFailed(address indexed player);
    event SkullJackpot(address indexed player);

    constructor(address _arcadePoints, address _zmolCredits) Ownable(msg.sender) {
        i_arcadePoints = ArcadePoints(_arcadePoints);
        i_zmolCredits = ZmolCredits(payable(_zmolCredits));
    }

    function play() external payable nonReentrant {
        i_zmolCredits.spendCredit(msg.sender);
        emit CreditUsed(msg.sender);

        uint8[3] memory result = spinReels(msg.sender);
        bool win = (result[0] == result[1] && result[1] == result[2]);

        emit SpinResult(msg.sender, result, win);

        if (win) {
            uint256 pointsToAdd = 5;

            if (result[0] == 2 && result[1] == 2 && result[2] == 2) {
                pointsToAdd = 13;
                emit SkullJackpot(msg.sender);
            }

            try i_arcadePoints.addPoints(msg.sender, pointsToAdd) {
            } catch {
                emit PointsFailed(msg.sender);
            }
        }
    }

    function spinReels(address player) internal view virtual returns (uint8[3] memory result) {
        for (uint8 i = 0; i < 3; i++) {
            result[i] = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, player, i))) % 3);
        }
    }

    function getCredits(address player) external view returns (uint256) {
        return i_zmolCredits.getCredits(player);
    }

    function withdraw() external onlyOwner {
        (bool success,) = payable(owner()).call{value: address(this).balance}("");
        require(success, "ETH withdraw failed");
    }

    receive() external payable {}
    fallback() external payable {}
}
