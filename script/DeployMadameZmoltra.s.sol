// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {MadameZmoltra} from "../src/MadameZmoltra.sol";
import {ZmolCredits} from "../src/ZmolCredits.sol";
import {ArcadePoints} from "../src/ArcadePoints.sol";

contract DeployMadameZmoltra is Script {
    function run() external {
        address credits = 0xAB78b49d877841f4329591946bD56D98f5879D70;
        address points = 0x3369558E7F64CBD6634763988B8C318cd232159B;

        vm.startBroadcast();

        MadameZmoltra zmoltra = new MadameZmoltra(credits, points);

        vm.stopBroadcast();

        console2.log("MadameZmoltra deployed at:", address(zmoltra));
    }
}