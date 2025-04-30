// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {ZmolCredits} from "../src/ZmolCredits.sol";
import {ArcadePoints} from "../src/ArcadePoints.sol";

contract HelperConfig is Script {
    struct Config {
        address credits;
        address points;
    }

    Config internal config;

    function activeConfig() external view returns (Config memory) {
        return config;
    }

    constructor() {
        if (block.chainid == 31337) {
            config = deployLocalMocks();
        } else if (block.chainid == 11155111) {
            config = Config({credits: address(0), points: address(0)});
        } else {
            revert("Unsupported");
        }
    }

    function deployLocalMocks() internal returns (Config memory) {
        console2.log("Deploying local mock Zmol contracts...");
        vm.startBroadcast();
        ZmolCredits credits = new ZmolCredits();
        ArcadePoints points = new ArcadePoints();
        vm.stopBroadcast();

        return Config({credits: address(credits), points: address(points)});
    }
}
