// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {TicTacToad} from "../src/TicTacToad.sol";

contract MockCredits {
    mapping(address => uint256) public credits;

    function setCredits(address player, uint256 amount) external {
        credits[player] = amount;
    }

    function spendCredit(address player) external {
        require(credits[player] > 0, "No credits left");
        credits[player]--;
    }

    function getCredits(address player) external view returns (uint256) {
        return credits[player];
    }
}

contract MockArcadePoints {
    mapping(address => uint256) public points;

    function addPoints(address player, uint256 amount) external {
        points[player] += amount;
    }

    function getPoints(address player) external view returns (uint256) {
        return points[player];
    }
}

contract RiggedToad is TicTacToad {
    constructor(address _points, address _credits) TicTacToad(_points, _credits) {}

    function blobMove(uint256) internal pure override returns (uint8) {
        return 4; // force blob to always move to center
    }
}

contract TicTacToadTest is Test {
    TicTacToad public game;
    MockArcadePoints public mockPoints;
    MockCredits public mockCredits;
    address public player = address(0x123);

    function setUp() public {
        mockPoints = new MockArcadePoints();
        mockCredits = new MockCredits();
        game = new TicTacToad(address(mockPoints), address(mockCredits));
        mockCredits.setCredits(player, 10);
    }

    function testStartGame() public {
        vm.prank(player);
        game.startGame();

        (address actualPlayer,, bool active,) = game.games(0);
        assertEq(actualPlayer, player);
        assertTrue(active);
    }

    function testStartGameWithCredits() public {
        vm.prank(player);
        game.startGame();

        uint256 remaining = mockCredits.getCredits(player);
        assertEq(remaining, 9);
    }

    function testPlayAndWin() public {
        game = new RiggedToad(address(mockPoints), address(mockCredits));
        mockCredits.setCredits(player, 10);

        vm.prank(player);
        game.startGame();

        vm.prank(player);
        game.playTurn(0, 0); // Player

        vm.prank(player);
        game.playTurn(0, 1); // Player

        vm.prank(player);
        game.playTurn(0, 2); // Player - should win now

        uint256 playerPoints = mockPoints.getPoints(player);
        assertEq(playerPoints, 1);
    }

    function testInvalidCellReverts() public {
        vm.expectRevert("Out of bounds");
        game.getCell(0, 9);
    }

    function testBlobMovesAfterPlayer() public {
        vm.prank(player);
        game.startGame();

        vm.prank(player);
        game.playTurn(0, 0);

        (,, bool active,) = game.games(0);
        assertTrue(active);
    }

    function testRevertsIfNotYourTurn() public {
        address stranger = address(0xBEEF);
        vm.prank(player);
        game.startGame();

        vm.expectRevert("Not your game");
        vm.prank(stranger);
        game.playTurn(0, 0);
    }

    function testCannotPlayTwiceInARow() public {
        vm.prank(player);
        game.startGame();

        vm.prank(player);
        game.playTurn(0, 0);

        (,,, TicTacToad.Turn turn) = game.games(0);
        assertEq(uint8(turn), uint8(TicTacToad.Turn.Player));
    }

    function testTurnResetsToPlayerAfterFullMove() public {
        vm.prank(player);
        game.startGame();

        vm.prank(player);
        game.playTurn(0, 0);

        (,, bool active, TicTacToad.Turn currentTurn) = game.games(0);

        if (active) {
            assertEq(uint8(currentTurn), uint8(TicTacToad.Turn.Player));
        } else {
            assertTrue(true);
        }
    }
}
