import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.base.org",
      }
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PK as string]
    }
  }
};

export default config;
