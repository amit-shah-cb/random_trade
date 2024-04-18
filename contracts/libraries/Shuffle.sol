// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";
//fisher-yattes shuffle
//https://jamesbachini.com/solidity-shuffle/

library Shuffle {
    
  

    function shuffle(uint8 size) internal view returns(uint8){
        uint8[] memory arr = new uint8[](size);
        for (uint8 i = 0; i < size; i++) {
                arr[i]=i;
        }
       
        for (uint256 i = 0; i < size; i++) {
            uint256 j = uint256(keccak256(abi.encode(block.prevrandao, i))) % size;
            uint8 tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr[0];
    }
}