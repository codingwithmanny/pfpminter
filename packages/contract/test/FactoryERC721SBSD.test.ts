// Imports
// ========================================================
import { expect } from "chai";
import { ethers } from "hardhat";
import { config } from "dotenv";
import ContractABI from "../artifacts/contracts/FactoryERC721SBSD.sol/FactoryERC721SBSD.json";
import { FactoryERC721SBSD__factory } from "../typechain-types";

// Config
// ========================================================
/**
 * Take advantage of ENV VARS
 */
config();

/**
 *
 */
const OWNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

/**
 *
 */
const RANDOM_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

/**
 * 
 */
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// Test JPG
// https://cloudflare-ipfs.com/ipfs/QmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2

// JSON
/**
 * 
 */
const JSON_DATA = {
  "description": "Test JPG",
  "external_url": "https://cloudflare-ipfs.com",
  "image": "https://cloudflare-ipfs.com/ipfs/QmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2",
  "name": "Test JPG #1",
  "attributes": [
    {
      "display_type": "number",
      "trait_type": "Identification Number",
      "value": 1
    }
  ]
}

// As
// data:application/json,%7B%22description%22%3A%22Test%20JPG%22%2C%22external_url%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%22%2C%22image%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2%22%2C%22name%22%3A%22Test%20JPG%20%231%22%2C%22attributes%22%3A%5B%7B%22display_type%22%3A%22number%22%2C%20%22trait_type%22%3A%22Identification%20Number%22%2C%20%22value%22%3A1%7D%5D%7D
const DATA_JSON_URL = "data:application/json,%7B%22description%22%3A%22Test%20JPG%22%2C%22external_url%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%22%2C%22image%22%3A%22https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmRG4BgEVcD3MuNaL3SxmZJcCEEYkRomw6PFEaha1Gagi2%22%2C%22name%22%3A%22Test%20JPG%20%231%22%2C%22attributes%22%3A%5B%7B%22display_type%22%3A%22number%22%2C%20%22trait_type%22%3A%22Identification%20Number%22%2C%20%22value%22%3A1%7D%5D%7D";

/**
 * 
 */
const NFT_NAME = "SBSDNFT";

/**
 * 
 */
const NFT_SYMBOL = "SSN";

// Helpers
// ========================================================
/**
 *
 * @returns
 */
const setupContract = async () => {
  const Contract = await ethers.getContractFactory("FactoryERC721SBSD");
  const contract = await Contract.deploy();
  await contract.deployed();
  return contract;
};

/**
 *
 * @param walletAddress
 */
const setupProvider = async (walletAddress: string) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner(walletAddress);
  return signer;
};

/**
 *
 * @param contractAddres
 * @param walletAddress
 * @returns
 */
const setupContactProvider = async (
  contractAddres: string,
  walletAddress: string
) => {
  const signer = await setupProvider(walletAddress);
  const contract = new ethers.Contract(contractAddres, ContractABI.abi, signer);
  return contract;
};

// Tests
// ========================================================
/**
 *
 */
describe(`${"FactoryERC721SBSD"} - Contract Tests`, () => {
  /**
   * Success
   */
  it("buildERC721SBSD - Should successfully build a ERC721SBSD contract", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      RANDOM_ADDRESS
    );

    // Init
    await contract.buildERC721SBSD(NFT_NAME, NFT_SYMBOL, DATA_JSON_URL, RANDOM_ADDRESS);
  });
});