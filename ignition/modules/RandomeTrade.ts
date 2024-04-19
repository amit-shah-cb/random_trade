import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RandomTradeModule = buildModule("RandomTradeModule", (m) => {
  const randomTrade = m.contract("RandomTrade", [
    `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`, //usdc on base
    [
      `0xdef1c0ded9bec7f1a1670819833240f027b25eff`//0x gateway on base

    ]  ]);

  return { randomTrade };
});

export default RandomTradeModule;
