# Random Trade Project

This Project 
- finds the top 5 trending tokens in the last hour via airstack
- generates a on-chain swap for the 5 tokens
- submits user entropy (uint256) and the 5 trades to a randomTrade gateway smart contract
- shuffles the trade and pick 1 to execute
- forwards funds to the msg.sender and emits the event
 
```shell
set .env
PK=<PRIVATE_KEY_WITH_GT_10_000_000_USDC_ON_BASE>
AIRSTACK_API_KEY=<>

npx hardhat test 

#only test e2e:

npx hardhat test --grep "random token swap"

npx hardhat ignition deploy ./ignition/modules/Lock.ts

#deploy to base 

npx hardhat ignition deploy ./ignition/modules/RandomeTrade.ts --network base

```

Extension

- make this a lootbox framework; you need to have collected x points via erc20 and we send 1_000_000 usdc of shitcoin to your address
- the cost to collect the x points >>> 1USDC