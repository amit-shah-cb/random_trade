// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./libraries/Shuffle.sol";

struct Trade{
    address to;
    bytes data;
    address outputToken;
    uint256 amount;
}

contract RandomTrade {
    uint public unlockTime;
    address payable public owner;
    address internal usdc;

    event ExecutedTrade(uint8 tradeIdx, uint256 outputAmount);

    constructor(address _usdc, address[] memory tradeGateways) payable {
        usdc = _usdc;
        owner = payable(msg.sender);
        for(uint i = 0; i < tradeGateways.length; i++){
            IERC20(usdc).approve(tradeGateways[i], type(uint256).max);
        }
    }

    function executeRandomTrade(uint256 entropy, Trade[] calldata trades) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        uint8 tradeIdx  = Shuffle.shuffle(block.prevrandao ^ entropy ,uint8(trades.length));
        console.log("tradeIdx: %o", tradeIdx);
        Trade memory trade = trades[tradeIdx];
        IERC20(usdc).transferFrom(msg.sender, address(this), trade.amount); // 1 USDC (6 decimals
        (bool success, ) = trade.to.call(trade.data);
        require(success == true, "Call to trade failed");
        // console.log("returnValue: %o", returnValue);
        //usdc transferFrom
        //output token fwd
        IERC20 outputToken = IERC20(trade.outputToken);
        uint balance = outputToken.balanceOf(address(this));
        console.log("output balance: %o", balance);
        outputToken.transfer(msg.sender, balance);
        emit ExecutedTrade(tradeIdx, balance);
    }


}

interface IERC20{
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}
