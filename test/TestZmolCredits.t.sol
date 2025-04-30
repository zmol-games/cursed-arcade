// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {ZmolCredits} from "../src/ZmolCredits.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestUser {
    receive() external payable {}
}

contract ZmolCreditsTest is Test {
    ZmolCredits public credits;
    TestUser public user;
    address public attacker = address(2);

    function setUp() public {
        user = new TestUser();

        bytes memory initData = abi.encodeWithSelector(ZmolCredits.initialize.selector, address(this), 0.003 ether);

        ERC1967Proxy proxy = new ERC1967Proxy(address(new ZmolCredits()), initData);
        credits = ZmolCredits(payable(address(proxy)));

        vm.deal(address(user), 10 ether);
    }

    function testBuyCreditsExactPayment() public {
        vm.prank(address(user));
        credits.buyCredits{value: 0.003 ether}(10);
        assertEq(credits.getCredits(address(user)), 10);
    }

    function testBuyingWrongBatchSizeReverts() public {
        vm.expectRevert("Must buy credits in batches of 10");
        vm.prank(address(user));
        credits.buyCredits{value: 0.003 ether}(9);
    }

    function testBuyingWithInsufficientETHReverts() public {
        vm.expectRevert("Insufficient ETH sent");
        vm.prank(address(user));
        credits.buyCredits{value: 0.001 ether}(10);
    }

    function testSpendCreditDecrements() public {
        vm.prank(address(user));
        credits.buyCredits{value: 0.003 ether}(10);

        credits.spendCredit(address(user));
        assertEq(credits.getCredits(address(user)), 9);
    }

    function testSpendWithoutCreditReverts() public {
        vm.expectRevert("No credits left");
        credits.spendCredit(address(user));
    }

    function testOwnerCanChangePrice() public {
        credits.setPricePerBatch(0.001 ether);
        assertEq(credits.pricePerBatch(), 0.001 ether);
    }

    function testSetPriceMustBeNonZero() public {
        vm.expectRevert("Price must be > 0");
        credits.setPricePerBatch(0);
    }

    function testNonOwnerCannotChangePrice() public {
        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, attacker));
        credits.setPricePerBatch(0.001 ether);
    }

    function testOwnerCanWithdraw() public {
        // Buy credits to send ETH in
        vm.prank(address(user));
        credits.buyCredits{value: 0.003 ether}(10);

        address payable recipient = payable(address(this));
        uint256 before = recipient.balance;
        credits.withdraw();
        uint256 afterBal = recipient.balance;
        assertGt(afterBal, before);
    }

    function testNonOwnerCannotWithdraw() public {
        vm.prank(address(user));
        credits.buyCredits{value: 0.003 ether}(10);

        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, attacker));
        credits.withdraw();
    }

    receive() external payable {}
}
