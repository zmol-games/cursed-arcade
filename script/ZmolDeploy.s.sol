// script/ZmolDeploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";

import {ZmolCredits} from "../src/ZmolCredits.sol";
import {ArcadePoints} from "../src/ArcadePoints.sol";
import {TicTacToad} from "../src/TicTacToad.sol";
import {BlobPaperScissors} from "../src/BlobPaperScissors.sol";
import {SlotMachine} from "../src/SlotMachine.sol";
import {ZmolFaucet} from "../src/ZmolFaucet.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ZmolDeploy is Script {
    function run() external {
        vm.startBroadcast();

        // --- Deploy Logic Contracts ---
        ZmolCredits creditsLogic = new ZmolCredits();
        ArcadePoints arcadeLogic = new ArcadePoints();

        // --- Encode Initializer Data ---
        bytes memory creditsInit = abi.encodeWithSelector(
            ZmolCredits.initialize.selector,
            msg.sender, // owner
            0.003 ether // pricePerBatch
        );

        bytes memory arcadeInit = abi.encodeWithSelector(
            ArcadePoints.initialize.selector,
            msg.sender // owner
        );

        // --- Deploy Proxies ---
        ERC1967Proxy creditsProxy = new ERC1967Proxy(address(creditsLogic), creditsInit);
        ERC1967Proxy arcadeProxy = new ERC1967Proxy(address(arcadeLogic), arcadeInit);

        // --- Cast to usable types ---
        ZmolCredits credits = ZmolCredits(payable(address(creditsProxy)));
        ArcadePoints arcade = ArcadePoints(address(arcadeProxy));

        // --- Deploy Faucet ---
        ZmolFaucet faucet = new ZmolFaucet(address(credits));

        // --- Wire faucet into ZmolCredits ---
        credits.setFaucet(address(faucet));

        // --- Deploy Game Contracts ---
        TicTacToad ticTacToad = new TicTacToad(address(arcade), address(credits));
        BlobPaperScissors blob = new BlobPaperScissors(address(arcade), address(credits));
        SlotMachine slots = new SlotMachine(address(arcade), address(credits));

        // --- Approve Games ---
        arcade.approveGame(address(ticTacToad), true);
        arcade.approveGame(address(blob), true);
        arcade.approveGame(address(slots), true);

        vm.stopBroadcast();

        // --- Logging ---
        console2.log("ZmolCredits (proxy):        %s", address(credits));
        console2.log("ArcadePoints (proxy):       %s", address(arcade));
        console2.log("ZmolFaucet:                 %s", address(faucet));
        console2.log("TicTacToad:                 %s", address(ticTacToad));
        console2.log("BlobPaperScissors:          %s", address(blob));
        console2.log("SlotMachine:                %s", address(slots));
        console2.log("ZmolCredits (logic):        %s", address(creditsLogic));
        console2.log("ArcadePoints (logic):       %s", address(arcadeLogic));
    }
}
