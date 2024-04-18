// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./libraries/Shuffle.sol";

struct Trade{
    address to;
    bytes data;
    address outputToken;
}

contract RandomTrade {
    uint public unlockTime;
    address payable public owner;

    event ExecutedTrade(uint8 tradeIdx);

    constructor() payable {
        owner = payable(msg.sender);
    }

    function executeRandomTrade(Trade[] calldata trades) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        uint8 tradeIdx  = Shuffle.shuffle(uint8(trades.length));
        Trade memory trade = trades[tradeIdx];
        

        //usdc transferFrom
        //output token fwd
        IERC20 outputToken = IERC20(trade.outputToken);
        uint balance = outputToken.balanceOf(address(this));
        outputToken.transfer(msg.sender, balance);

        emit ExecutedTrade(tradeIdx);
    }
}

interface IERC20{
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}
