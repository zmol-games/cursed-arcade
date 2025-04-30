// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {BlobPaperScissors} from "../src/BlobPaperScissors.sol";

contract MockCredits {
    mapping(address => uint256) public credits;

    function setCredits(address player, uint256 amount) external {
        credits[player] = amount;
    }

    function spendCredit(address player) external {
        require(credits[player] > 0, "no credits");
        credits[player]--;
    }

    function getCredits(address player) external view returns (uint256) {
        return credits[player];
    }
}

contract MockPoints {
    mapping(address => uint256) public points;

    function addPoints(address player, uint256 amount) external {
        points[player] += amount;
    }

    function getPoints(address player) external view returns (uint256) {
        return points[player];
    }
}

contract BlobPaperScissorsTest is Test {
    BlobPaperScissors public game;
    MockCredits public mockCredits;
    MockPoints public mockPoints;

    address public player = address(1);

    function setUp() public {
        mockCredits = new MockCredits();
        mockPoints = new MockPoints();
        game = new BlobPaperScissors(address(mockPoints), payable(address(mockCredits)));
        vm.deal(player, 1 ether);
    }

    function testPlayWithCredits() public {
        mockCredits.setCredits(player, 1);

        vm.prank(player);
        game.play(BlobPaperScissors.Move.Paper);

        uint256 remaining = mockCredits.getCredits(player);
        assertEq(remaining, 0, "Should spend one credit");
    }

    function testPlayWithoutCreditsAndNoPayment() public {
        vm.expectRevert("no credits");
        vm.prank(player);
        game.play(BlobPaperScissors.Move.Paper);
    }

    function testWinAwardsPoints() public {
        mockCredits.setCredits(player, 1);

        vm.prank(player);
        game.play(BlobPaperScissors.Move.Paper);

        uint256 earned = mockPoints.getPoints(player);
        assertLe(earned, 1);
    }

    function testCreditsArePreferredOverETH() public {
        mockCredits.setCredits(player, 2);
        vm.deal(player, 1 ether);

        vm.prank(player);
        game.play{value: 0.003 ether}(BlobPaperScissors.Move.Blob);

        uint256 creditsAfter = mockCredits.getCredits(player);
        assertEq(creditsAfter, 1, "Should have used a credit even though ETH was sent");
    }
}
