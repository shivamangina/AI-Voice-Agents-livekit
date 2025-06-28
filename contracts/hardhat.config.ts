import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@chainlink/hardhat-chainlink";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
   solidity: {
      version: "0.8.19",
      settings: {
         optimizer: {
            enabled: true,
            runs: 200,
         },
      },
   },
   networks: {
      sepolia: {
         url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 11155111,
      },
      hardhat: {
         chainId: 31337,
      },
   },
   etherscan: {
      apiKey: {
         sepolia: process.env.ETHERSCAN_API_KEY || "",
      },
   },
   gasReporter: {
      enabled: process.env.REPORT_GAS !== undefined,
      currency: "USD",
   },
};

export default config; 