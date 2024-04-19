// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./libraries/Shuffle.sol";

struct Trade{
    address to;
    bytes data;
    address outputToken;
    uint256 amount;
}

contract RandomTrade {
    address payable public owner;
    address internal usdc;

    event ExecutedTrade(address token, uint256 amount);

    constructor(address _usdc, address[] memory tradeGateways) payable {
        usdc = _usdc;
        owner = payable(msg.sender);
        for(uint i = 0; i < tradeGateways.length; i++){
            IERC20(usdc).approve(tradeGateways[i], type(uint256).max);
        }
    }

    function executeRandomTrade(uint256 entropy, Trade[] calldata trades) public {
        uint8 tradeIdx  = Shuffle.shuffle(block.prevrandao ^ entropy ,uint8(trades.length));
        Trade memory trade = trades[tradeIdx];
        IERC20(usdc).transferFrom(msg.sender, address(this), trade.amount); // 1 USDC (6 decimals
        (bool success,bytes memory resultBytes ) = trade.to.call(trade.data);
        uint256 balance;
        if(success){
            IERC20 outputToken = IERC20(trade.outputToken);
            balance = outputToken.balanceOf(address(this));
            outputToken.transfer(msg.sender, balance);
        }else{
            revert(_getRevertMsg(resultBytes));
        }
        emit ExecutedTrade(trade.outputToken, balance);
    }

    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
    // If the _res length is less than 68, then the transaction failed silently (without a revert message)
    if (_returnData.length < 68) return 'Transaction reverted silently';

    assembly {
        // Slice the sighash.
        _returnData := add(_returnData, 0x04)
    }
    return abi.decode(_returnData, (string)); // All that remains is the revert string
}

}

interface IERC20{
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}
