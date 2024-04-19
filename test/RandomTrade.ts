import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import axios from "axios";
import { getTrendingTokens } from "./utils/airstack";
import { IERC20__factory } from "../typechain-types";
import { Result, Root } from "./utils/models";

const getTrendingTokensMock = async ():Promise<any> => {
return JSON.parse(`{
  "TrendingTokens": {
      "TrendingToken": [
          {
              "address": "0x9de16c805a3227b9b92e39a446f9d56cf59fe640",
              "criteria": "unique_holders",
              "criteriaCount": 90373,
              "token": {
                  "name": "Bento"
              }
          },
          {
              "address": "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
              "criteria": "unique_holders",
              "criteriaCount": 683,
              "token": {
                  "name": "Degen"
              }
          },
          {
              "address": "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
              "criteria": "unique_holders",
              "criteriaCount": 597,
              "token": {
                  "name": "Aerodrome"
              }
          },
          {
              "address": "0xece7b98bd817ee5b1f2f536daf34d0b6af8bb542",
              "criteria": "unique_holders",
              "criteriaCount": 444,
              "token": {
                  "name": "BLACK ROCK"
              }
          },
          {
              "address": "0xf04ab303616b96afd6f8e47e97f0f85f7b8f405e",
              "criteria": "unique_holders",
              "criteriaCount": 385,
              "token": {
                  "name": "Byte"
              }
          }
      ]
  }
}`);
}

describe("RandomTrade", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const wallet = new ethers.Wallet(process.env.PK as string, hre.ethers.provider);

    const RT = await hre.ethers.getContractFactory("RandomTrade");
    const randomTrade = await RT.deploy(`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`,[`0xdef1c0ded9bec7f1a1670819833240f027b25eff`]);

    return { randomTrade, owner, otherAccount, wallet };
  }

  describe("Deployment", function () {
    it("can deploy randomTrade endpoint", async function () {
      const { randomTrade, owner, otherAccount , wallet} = await loadFixture(deployFixture);
      expect(wallet.address).to.equal(`0x4C64C7dC4fc7ba5B89fAd3AEbC68892bFC1B67d5`)
      
      expect(await randomTrade).to.not.be.null;
    });

    it("can generate trending token swaps", async function () {
      const { randomTrade, owner, otherAccount , wallet} = await loadFixture(deployFixture);
      const tt = await getTrendingTokensMock();
      const usdc = IERC20__factory.connect(`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`, wallet);
     
      console.log(await usdc.balanceOf(wallet.address));
     
      console.log(ethers.version);
      for(let i = 0; i < tt.TrendingTokens.TrendingToken.length; i++) {
        const token = tt.TrendingTokens.TrendingToken[i];
        const address = token.address;
        const slippage = 500;
        const {data} = await axios.get(`https://api.wallet.coinbase.com/rpc/v3/swap/trade?fromAddress=${wallet.address}&from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&to=${address}&amount=1000000&amountReference=from&chainId=8453&slippagePercentage=${slippage}`)
        const trade = data as Root;
        const approveInfTx = await usdc.approve(trade.result.tx.to, ethers.MaxInt256);
        const approveInfReceipt = await approveInfTx.wait();

        const tradeResult = await wallet.sendTransaction(trade.result.tx);
        
        const receipt = await tradeResult.wait();
        console.log(`Trade:`,receipt?.status);
        const outputToken = IERC20__factory.connect(token.address, wallet.provider)     
        console.log(token.token.name,`:`, await outputToken.balanceOf(wallet.address));
      }
    }).timeout(1200000);

    // 
    it("can swap fried chicken", async function () {
     
      const { randomTrade, owner, otherAccount , wallet} = await loadFixture(deployFixture);
      const tt = await getTrendingTokens();
      const usdc = IERC20__factory.connect(`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`, wallet);
      console.log(await usdc.balanceOf(wallet.address));
      const infApproveTx = await usdc.approve(await randomTrade.getAddress(), ethers.MaxInt256);
      const infApproveReceipt = await infApproveTx.wait();
      expect(infApproveReceipt?.status).to.equal(1);
      let trades:any = [];     
      const address = `0x7d12aeb5d96d221071d176980d23c213d88d9998`;
      const slippage = 500;
      const {data} = await axios.get(`https://api.wallet.coinbase.com/rpc/v3/swap/trade?fromAddress=${wallet.address}&from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&to=${address}&amount=1000000&amountReference=from&chainId=8453&slippagePercentage=${slippage}`)
      const trade = data as Root;
      const outputToken = IERC20__factory.connect(address, wallet.provider)     
      console.log('FCKN',`:`, await outputToken.balanceOf(wallet.address));
      trades.push({
        to:trade.result.tx.to,
        data:trade.result.tx.data,
        outputToken:trade.result.quote.toAsset.address,
        amount:1_000_000
      });
      
      console.log("trades:",trades);

      const connectedRT = randomTrade.connect(wallet);
      const entropy = ethers.randomBytes(32);
      const tradeResult = await connectedRT.executeRandomTrade(ethers.hexlify(entropy), trades);
      const receipt = await tradeResult.wait();
      expect(receipt?.status).to.equal(1);     
    }).timeout(1200000);

    

    it("can swap fomo", async function () {
     
      const { randomTrade, owner, otherAccount , wallet} = await loadFixture(deployFixture);
      const tt = await getTrendingTokens();
      const usdc = IERC20__factory.connect(`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`, wallet);
      console.log(await usdc.balanceOf(wallet.address));
      const infApproveTx = await usdc.approve(await randomTrade.getAddress(), ethers.MaxInt256);
      const infApproveReceipt = await infApproveTx.wait();
      expect(infApproveReceipt?.status).to.equal(1);
      let trades:any = [];     
      const address = `0xe3086852a4b125803c815a158249ae468a3254ca`;
      const slippage = 500;
      const {data} = await axios.get(`https://api.wallet.coinbase.com/rpc/v3/swap/trade?fromAddress=${wallet.address}&from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&to=${address}&amount=1000000&amountReference=from&chainId=8453&slippagePercentage=${slippage}`)
      const trade = data as Root;
      const outputToken = IERC20__factory.connect(address, wallet.provider)     
      console.log('FCKN',`:`, await outputToken.balanceOf(wallet.address));
      trades.push({
        to:trade.result.tx.to,
        data:trade.result.tx.data,
        outputToken:trade.result.quote.toAsset.address,
        amount:1_000_000
      });
      
      console.log("trades:",trades);

      const connectedRT = randomTrade.connect(wallet);
      const entropy = ethers.randomBytes(32);
      const tradeResult = await connectedRT.executeRandomTrade(ethers.hexlify(entropy), trades);
      const receipt = await tradeResult.wait();
      expect(receipt?.status).to.equal(1);     
    }).timeout(1200000);

    it("random token swap", async function () {
      const { randomTrade, owner, otherAccount , wallet} = await loadFixture(deployFixture);
      const tt = await getTrendingTokens();
      const usdc = IERC20__factory.connect(`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`, wallet);
      console.log(await usdc.balanceOf(wallet.address));
      const infApproveTx = await usdc.approve(await randomTrade.getAddress(), ethers.MaxInt256);
      const infApproveReceipt = await infApproveTx.wait();
      expect(infApproveReceipt?.status).to.equal(1);
      
      const rtAddress = await randomTrade.getAddress();
      const urls = await Promise.all(tt.TrendingTokens.TrendingToken.map(async (token:any) => {
        const slippage=700;
        return `https://api.wallet.coinbase.com/rpc/v3/swap/trade?fromAddress=${rtAddress}&from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&to=${token.address}&amount=1000000&amountReference=from&chainId=8453&slippagePercentage=${slippage}`
      }))
      console.log(urls);
      const reqs = await Promise.all(urls.map(async (url:any) => {
        return await axios.get(url);
      }));
      const trades = reqs.map((req:any) => {
        const trade = req.data as Root;
        return {
          to:trade.result.tx.to,
          data:trade.result.tx.data,
          outputToken:trade.result.quote.toAsset.address,
          amount:1_000_000
        }
      });
      
      console.log("trades:",trades);
      const connectedRT = randomTrade.connect(wallet);
      const entropy = ethers.randomBytes(32);
      const tradeResult = await connectedRT.executeRandomTrade(ethers.hexlify(entropy), trades);
      const receipt = await tradeResult.wait();
      expect(receipt?.status).to.equal(1);

      
    }).timeout(1200000);
    
  });

});
  
