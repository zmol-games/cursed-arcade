// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {SlotMachine} from "../src/SlotMachine.sol";

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

contract RiggedSlotMachine is SlotMachine {
    uint8[3] forcedResult;

    constructor(address _arcadePoints, address _zmolCredits) SlotMachine(_arcadePoints, _zmolCredits) {}

    function setForcedResult(uint8[3] memory result) external {
        forcedResult = result;
    }

    function spinReels(address) internal view override returns (uint8[3] memory) {
        return forcedResult;
    }
}

contract SlotMachineTest is Test {
    event SpinResult(address indexed player, uint8[3] result, bool win);

    SlotMachine public slot;
    MockCredits public mockCredits;
    MockPoints public mockPoints;
    address public player = address(1);

    function setUp() public {
        mockCredits = new MockCredits();
        mockPoints = new MockPoints();
        slot = new SlotMachine(address(mockPoints), payable(address(mockCredits)));

        vm.deal(player, 1 ether);
    }

    function testPlayWithCredits() public {
        mockCredits.setCredits(player, 1);

        vm.prank(player);
        slot.play();

        uint256 remaining = mockCredits.getCredits(player);
        assertEq(remaining, 0, "Should consume one credit");
    }

    function testWinningAddsPoint() public {
        RiggedSlotMachine rigged = new RiggedSlotMachine(address(mockPoints), payable(address(mockCredits)));
        rigged.setForcedResult([2, 2, 2]);

        mockCredits.setCredits(player, 1);
        vm.prank(player);
        rigged.play();

        uint256 pts = mockPoints.getPoints(player);
        assertEq(pts, 13, "Player should receive 13 points for a jackpot");
    }

    function testEmitsSpinResultEvent() public {
        mockCredits.setCredits(player, 1);
        vm.expectEmit(true, false, false, false);
        emit SpinResult(player, [0, 0, 0], false);
        vm.prank(player);
        slot.play();
    }

    function testEmitsExactSpinResultAndWin() public {
        RiggedSlotMachine rigged = new RiggedSlotMachine(address(mockPoints), payable(address(mockCredits)));

        uint8[3] memory result = [2, 2, 2];
        rigged.setForcedResult(result);
        mockCredits.setCredits(player, 1);

        vm.expectEmit(true, false, true, true);
        emit SpinResult(player, result, true);

        vm.prank(player);
        rigged.play();

        uint256 points = mockPoints.getPoints(player);
        assertEq(points, 13, "Player should receive 13 points on jackpot win");
    }

    function testEmitsExactSpinResultAndLose() public {
        RiggedSlotMachine rigged = new RiggedSlotMachine(address(mockPoints), payable(address(mockCredits)));

        uint8[3] memory result = [2, 2, 1];
        rigged.setForcedResult(result);
        mockCredits.setCredits(player, 1);

        vm.expectEmit(true, false, true, true);
        emit SpinResult(player, result, false);

        vm.prank(player);
        rigged.play();

        uint256 points = mockPoints.getPoints(player);
        assertEq(points, 0, "No points should be awarded on loss");
    }
}
