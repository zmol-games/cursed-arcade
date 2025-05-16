// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ZmolCredits} from "./ZmolCredits.sol";
import {ArcadePoints} from "./ArcadePoints.sol";

contract BlobPaperScissors is Ownable, ReentrancyGuard {
    enum Move {
        Blob,
        Paper,
        Scissors
    }
    enum Outcome {
        Win,
        Lose,
        Tie
    }

    ArcadePoints public immutable i_arcadePoints;
    ZmolCredits public immutable i_zmolCredits;

    event GamePlayed(address indexed player, Move playerMove, Move blobMove, Outcome outcome);
    event CreditUsed(address indexed player);
    event PointsFailed(address indexed player);

    constructor(address _arcadePoints, address _zmolCredits) Ownable(msg.sender) {
        i_arcadePoints = ArcadePoints(_arcadePoints);
        i_zmolCredits = ZmolCredits(payable(_zmolCredits));
    }

    function play(Move playerMove) external payable nonReentrant {
        require(uint8(playerMove) <= 2, "Invalid move");

        i_zmolCredits.spendCredit(msg.sender);
        // credit spent successfully
        emit CreditUsed(msg.sender);

        uint8 blobNum = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3);
        Move blobMove = Move(blobNum);

        Outcome outcome = determineOutcome(playerMove, blobMove);

        if (outcome == Outcome.Win) {
            try i_arcadePoints.addPoints(msg.sender, 1) {}
            catch {
                emit PointsFailed(msg.sender);
            }
        }

        emit GamePlayed(msg.sender, playerMove, blobMove, outcome);
    }

    function determineOutcome(Move player, Move blob) internal pure returns (Outcome) {
        if (player == blob) {
            return Outcome.Tie;
        }

        if (
            (player == Move.Blob && blob == Move.Scissors) || (player == Move.Scissors && blob == Move.Paper)
                || (player == Move.Paper && blob == Move.Blob)
        ) {
            return Outcome.Win;
        } else {
            return Outcome.Lose;
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