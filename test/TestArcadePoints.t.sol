// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {ArcadePoints} from "../src/ArcadePoints.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ArcadePointsTest is Test {
    ArcadePoints public points;
    address public owner = address(this);
    address public player = address(0x123);
    address public game = address(0x456);
    address public shop = address(0x789);
    address public attacker = address(0xBEEF);

    function setUp() public {
        ArcadePoints logic = new ArcadePoints();

        bytes memory init = abi.encodeWithSelector(ArcadePoints.initialize.selector, owner);

        ERC1967Proxy proxy = new ERC1967Proxy(address(logic), init);
        points = ArcadePoints(address(proxy));
    }

    function testOnlyApprovedGameCanAddPoints() public {
        // Not approved, should revert
        vm.prank(game);
        vm.expectRevert("Not approved game");
        points.addPoints(player, 1);

        // Approve and add
        points.approveGame(game, true);

        vm.prank(game);
        points.addPoints(player, 5);

        assertEq(points.getPoints(player), 5);
    }

    function testOnlyApprovedShopCanSpendPoints() public {
        // Approve game and give player points
        points.approveGame(game, true);
        vm.prank(game);
        points.addPoints(player, 10);

        // Not approved shop tries to spend
        vm.prank(shop);
        vm.expectRevert("Not approved prize shop");
        points.spendPoints(player, 1);

        // Approve shop
        points.approvePrizeShop(shop, true);

        // Spend points
        vm.prank(shop);
        points.spendPoints(player, 4);
        assertEq(points.getPoints(player), 6);
    }

    function testCannotSpendMorePointsThanYouHave() public {
        points.approveGame(game, true);
        vm.prank(game);
        points.addPoints(player, 2);

        points.approvePrizeShop(shop, true);
        vm.prank(shop);
        vm.expectRevert("Not enough points");
        points.spendPoints(player, 5);
    }

    function testOnlyOwnerCanApproveGame() public {
        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, attacker));
        points.approveGame(address(0x1234), true);
    }

    function testOnlyOwnerCanApproveShop() public {
        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, attacker));
        points.approvePrizeShop(address(0x5678), true);
    }
}
