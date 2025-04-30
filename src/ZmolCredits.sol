// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ZmolCredits is Initializable, OwnableUpgradeable {
    address public faucet;

    uint256 public constant CREDITS_PER_BATCH = 10;
    uint8 public constant PLAYS_PER_CREDIT = 1;
    uint256 public pricePerBatch;

    mapping(address => uint256) public credits;

    event CreditsPurchased(address indexed player, uint256 creditsBought);
    event CreditSpent(address indexed player);
    event PricePerBatchUpdated(uint256 oldPrice, uint256 newPrice);

    function initialize(address owner_, uint256 initialPricePerBatch) public initializer {
        __Ownable_init(owner_);
        pricePerBatch = initialPricePerBatch;
    }

    function buyCredits(uint256 numCredits) external payable {
        require(numCredits % CREDITS_PER_BATCH == 0, "Must buy credits in batches of 10");

        uint256 numBatches = numCredits / CREDITS_PER_BATCH;
        uint256 cost = numBatches * pricePerBatch;

        require(msg.value >= cost, "Insufficient ETH sent");
        credits[msg.sender] += numCredits;

        emit CreditsPurchased(msg.sender, numCredits);
    }

    function spendCredit(address player) external {
        require(credits[player] > 0, "No credits left");
        credits[player]--;
        emit CreditSpent(player);
    }

    function setPricePerBatch(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be > 0");
        uint256 oldPrice = pricePerBatch;
        pricePerBatch = newPrice;
        emit PricePerBatchUpdated(oldPrice, newPrice);
    }

    function setFaucet(address faucet_) external onlyOwner {
        faucet = faucet_;
    }

    function grantFreeCredit(address player) external {
        require(msg.sender == faucet, "Only faucet can grant credits");
        credits[player] += 1;
        emit CreditsPurchased(player, 1);
    }

    function getCredits(address player) external view returns (uint256) {
        return credits[player];
    }

    function withdraw() external onlyOwner {
        (bool success,) = payable(owner()).call{value: address(this).balance}("");
        require(success, "ETH withdraw failed");
    }

    receive() external payable {}
    fallback() external payable {}
}
