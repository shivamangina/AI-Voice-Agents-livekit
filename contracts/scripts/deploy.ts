import { ethers } from "hardhat";

async function main() {
   console.log("Deploying CustomerSupportOracle...");

   // Chainlink VRF addresses for Sepolia
   const VRF_COORDINATOR_V2_ADDRESS = "0x50AE5EaF207eB49dC5f4968a1e538Dc8c500668E";
   const SUBSCRIPTION_ID = process.env.CHAINLINK_SUBSCRIPTION_ID || "1"; // You'll need to create a subscription
   const GAS_LANE = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"; // 150 gwei Key Hash
   const CALLBACK_GAS_LIMIT = 500000;

   const CustomerSupportOracle = await ethers.getContractFactory("CustomerSupportOracle");
   const customerSupportOracle = await CustomerSupportOracle.deploy(
      VRF_COORDINATOR_V2_ADDRESS,
      SUBSCRIPTION_ID,
      GAS_LANE,
      CALLBACK_GAS_LIMIT
   );

   await customerSupportOracle.waitForDeployment();
   const address = await customerSupportOracle.getAddress();

   console.log("CustomerSupportOracle deployed to:", address);
   console.log("Network:", network.name);
   console.log("Block number:", await ethers.provider.getBlockNumber());

   // Verify the contract on Etherscan
   if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log("Waiting for block confirmations...");
      await customerSupportOracle.deploymentTransaction()?.wait(6);
      await verify(address, [
         VRF_COORDINATOR_V2_ADDRESS,
         SUBSCRIPTION_ID,
         GAS_LANE,
         CALLBACK_GAS_LIMIT
      ]);
   }
}

async function verify(contractAddress: string, args: any[]) {
   console.log("Verifying contract...");
   try {
      await hre.run("verify:verify", {
         address: contractAddress,
         constructorArguments: args,
      });
   } catch (e: any) {
      if (e.message.toLowerCase().includes("already verified")) {
         console.log("Already verified!");
      } else {
         console.log(e);
      }
   }
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   }); 