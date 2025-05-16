// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ArcadePoints is Initializable, OwnableUpgradeable {
    mapping(address => uint256) public points;
    mapping(address => bool) public approvedGames;
    mapping(address => bool) public approvedPrizeShops;

    event PointsAdded(address indexed player, uint256 amount);
    event PointsSpent(address indexed player, uint256 amount);
    event GameApproved(address indexed game);
    event PrizeShopApproved(address indexed shop);

    modifier onlyGame() {
        require(approvedGames[msg.sender], "Not approved game");
        _;
    }

    modifier onlyPrizeShop() {
        require(approvedPrizeShops[msg.sender], "Not approved prize shop");
        _;
    }

    function initialize(address owner_) public initializer {
        __Ownable_init(owner_);
    }

    function addPoints(address player, uint256 amount) external onlyGame {
        points[player] += amount;
        emit PointsAdded(player, amount);
    }

    function spendPoints(address player, uint256 amount) external onlyPrizeShop {
        require(points[player] >= amount, "Not enough points");
        points[player] -= amount;
        emit PointsSpent(player, amount);
    }

    function approveGame(address game, bool approved) external onlyOwner {
        approvedGames[game] = approved;
        emit GameApproved(game);
    }

    function approvePrizeShop(address shop, bool approved) external onlyOwner {
        approvedPrizeShops[shop] = approved;
        emit PrizeShopApproved(shop);
    }

    function getPoints(address player) external view returns (uint256) {
        return points[player];
    }
}