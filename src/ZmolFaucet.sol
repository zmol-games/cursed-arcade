// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IZmolCredits {
    function grantFreeCredit(address player) external;
}

contract ZmolFaucet {
    IZmolCredits public zmolCredits;
    mapping(address => uint256) public lastClaimTime;
    address public owner;

    constructor(address zmolCredits_) {
        zmolCredits = IZmolCredits(zmolCredits_);
        owner = msg.sender;
    }

    function claimFreeCredit() external {
        require(block.timestamp >= lastClaimTime[msg.sender] + 1 days, "Wait 24 hours between claims");

        lastClaimTime[msg.sender] = block.timestamp;
        zmolCredits.grantFreeCredit(msg.sender);
    }

    function setZmolCredits(address zmolCredits_) external {
        require(msg.sender == owner, "Only owner can update credits");
        zmolCredits = IZmolCredits(zmolCredits_);
    }
}
