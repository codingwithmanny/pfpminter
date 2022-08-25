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

  // Test JPG
  // https://cloudflare-ipfs.com/ipfs/QmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2

  // JSON
  // {
  //   "description": "Test JPG",
  //   "external_url": "https://cloudflare-ipfs.com",
  //   "image": "https://cloudflare-ipfs.com/ipfs/QmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2",
  //   "name": "Test JPG #1",
  //   "attributes": [
  //     {
  //       "display_type": "number",
  //       "trait_type": "Identification Number",
  //       "value": 1
  //     }
  //   ]
  // }

  // As
  // data:application/json,%7B%22description%22%3A%22Test%20JPG%22%2C%22external_url%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%22%2C%22image%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2%22%2C%22name%22%3A%22Test%20JPG%20%231%22%2C%22attributes%22%3A%5B%7B%22display_type%22%3A%22number%22%2C%20%22trait_type%22%3A%22Identification%20Number%22%2C%20%22value%22%3A1%7D%5D%7D
  const dataJsonUrl = "data:application/json,%7B%22description%22%3A%22Test%20JPG%22%2C%22external_url%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%22%2C%22image%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2%22%2C%22name%22%3A%22Test%20JPG%20%231%22%2C%22attributes%22%3A%5B%7B%22display_type%22%3A%22number%22%2C%20%22trait_type%22%3A%22Identification%20Number%22%2C%20%22value%22%3A1%7D%5D%7D";
  const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  // // We get the contract to deploy
  const Contract = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy("SBSDNFT", "SSN", dataJsonUrl, account);

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