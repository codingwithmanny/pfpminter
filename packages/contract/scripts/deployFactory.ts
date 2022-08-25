// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// Imports
// ========================================================
import { ethers } from "hardhat";
import { config } from "dotenv";

// Config
// ========================================================
/**
 * Take advantage of ENV VARS
 */
config();

/**
 * Name of contract
 */
const CONTRACT_NAME = process.env.CONTRACT_NAME || "UNKNOWN_CONTRACT_NAME";

// Main Deploy Script
// ========================================================
/**
 *
 */
const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // // We get the contract to deploy
  const Contract = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`${CONTRACT_NAME} deployed to:`, contract.address);
};

// Init
// ========================================================
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});