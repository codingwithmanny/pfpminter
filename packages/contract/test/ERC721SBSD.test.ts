// Imports
// ========================================================
import { expect } from "chai";
import { ethers } from "hardhat";
import { config } from "dotenv";
import ContractABI from "../artifacts/contracts/ERC721SBSD.sol/ERC721SBSD.json";

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
  const Contract = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy(NFT_NAME, NFT_SYMBOL, DATA_JSON_URL, RANDOM_ADDRESS);
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
describe(`${CONTRACT_NAME} - Contract Tests`, () => {
  /**
   * Success
   */
  it(`emit Transfer - Should show ${RANDOM_ADDRESS}`, async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );
    const filterFrom = contract.filters.Transfer(ZERO_ADDRESS, null);
    const result = await contract.queryFilter(filterFrom, 0);

    // Expectations
    expect(result?.[0]?.event).to.be.eq('Transfer');
    expect(result?.[0]?.args?.[0]).to.be.eq(ZERO_ADDRESS);
    expect(result?.[0]?.args?.[1]).to.be.eq(RANDOM_ADDRESS);
    expect(result?.[0]?.args?.[2].toNumber()).to.be.eq(1);
  });

  /**
   * Failure
   */
  it("burn - Should revert with NonExistentToken", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.burn(0);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NonExistentToken")).to.be.true;
    }
  });

  /**
   * Failure
   */
  it("burn - Should revert with NotApprovedOrOwner", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.burn(1);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NotApprovedOrOwner")).to.be.true;
    }
  });

  /**
   * Success
   */
  it("burn - Should successfully burn", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      RANDOM_ADDRESS
    );

    // Init
    await contract.burn(1);
    const result = await contract.balanceOf(RANDOM_ADDRESS);

    const filterFrom = contract.filters.Transfer(RANDOM_ADDRESS, null);
    const filterResult = await contract.queryFilter(filterFrom, 0);

    // Expectations
    expect(result.toNumber()).to.be.eq(0);
    expect(filterResult?.[0]?.event).to.be.eq('Transfer');
    expect(filterResult?.[0]?.args?.[0]).to.be.eq(RANDOM_ADDRESS);
    expect(filterResult?.[0]?.args?.[1]).to.be.eq(ZERO_ADDRESS);
    expect(filterResult?.[0]?.args?.[2].toNumber()).to.be.eq(1);
  });

  /**
   * Failure
   */
  it.skip("balanceOf - Should revert with ZeroAddressError", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.balanceOf(ZERO_ADDRESS);
    } catch (error) {
      // Expectations
      expect((error as any).errorName).to.be.eq("ZeroAddressError");
    }
  });

  /**
   * Failure
   */
  it.skip("balanceOf - Should return 0 with OWNER_ADDRESS", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.balanceOf(OWNER_ADDRESS);

    // Expectations
    expect(result.toNumber()).to.be.eq(0);
  });

  /**
   * Success
   */
  it.skip("balanceOf - Should return 0 with RANDOM_ADDRESS", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.balanceOf(RANDOM_ADDRESS);

    // Expectations
    expect(result.toNumber()).to.be.eq(1);
  });

  /**
   * Failure
   */
  it.skip("ownerOf - Should return address 0x0 with 0", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.ownerOf(0);

    // Expectations
    expect(result).to.be.eq(ZERO_ADDRESS);
  });

  /**
   * Failure
   */
  it.skip("ownerOf - Should return address 0x0 with 2", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.ownerOf(2);

    // Expectations
    expect(result).to.be.eq(ZERO_ADDRESS);
  });

  /**
   * Success
   */
  it(`ownerOf - Should return address ${RANDOM_ADDRESS} with 1`, async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.ownerOf(1);

    // Expectations
    expect(result).to.be.eq(RANDOM_ADDRESS);
  });

  /**
   * Failure
   */
  it.skip("transferFrom - Should revert with NotApprovedOrOwner", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.transferFrom(OWNER_ADDRESS, ZERO_ADDRESS, 1);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NotApprovedOrOwner")).to.be.true;
    }
  });

  /**
   * Failure
   */
  it.skip("approve - Should revert with NotApprovedOrOwner", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.approve(OWNER_ADDRESS, 1);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NotApprovedOrOwner")).to.be.true;
    }
  });

  /**
   * Failure
   */
  it.skip("setApprovalForAll - Should revert with NotApprovedOrOwner", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.setApprovalForAll(OWNER_ADDRESS, true);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NotApprovedOrOwner")).to.be.true;
    }
  });

  /**
   * Failure
   */
  it.skip("getApproved - Should revert with NonExistentToken", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.getApproved(0);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NonExistentToken")).to.be.true;
    }
  });

  /**
   * Success
   */
  it(`getApproved - Should return ${RANDOM_ADDRESS}`, async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.getApproved(1);

    // Expectations
    expect(result).to.be.eq(RANDOM_ADDRESS);
  });

  /**
   * Failure
   */
  it.skip("isApprovedForAll - Should revert with NotApprovedOrOwner", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.isApprovedForAll(OWNER_ADDRESS, RANDOM_ADDRESS);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NotApprovedOrOwner")).to.be.true;
    }
  });

  /**
   * Success
   */
  it(`name - Should return ${NFT_NAME}`, async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.name();

    // Expectations
    expect(result).to.be.eq(NFT_NAME);
  });

  /**
   * Success
   */
  it(`symbol - Should return ${NFT_SYMBOL}`, async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.symbol();

    // Expectations
    expect(result).to.be.eq(NFT_SYMBOL);
  });

  /**
   * Failure
   */
  it.skip("tokenURI - Should revert with NonExistentToken with 0", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    try {
      await contract.tokenURI(0);
    } catch (error) {
      // Expectations
      expect((error as any).toString().includes("NonExistentToken")).to.be.true;
    }
  });

  /**
   * Success
   */
  it.skip("tokenURI - Should return baseURI", async () => {
    // Setup
    const deployed = await (await setupContract()).deployed();
    const contract = await setupContactProvider(
      deployed.address,
      OWNER_ADDRESS
    );

    // Init
    const result = await contract.tokenURI(1);
    const json = JSON.parse(decodeURIComponent(result.replace('data:application/json,', '')).toString());

    // Expectations
    expect(json.description).to.be.eq(JSON_DATA.description);
    expect(json.external_url).to.be.eq(JSON_DATA.external_url);
    expect(json.image).to.be.eq(JSON_DATA.image);
    expect(json.name).to.be.eq(JSON_DATA.name);
    expect(json.attributes?.[0]?.display_type).to.be.eq(JSON_DATA.attributes[0].display_type);
    expect(json.attributes?.[0]?.trait_type).to.be.eq(JSON_DATA.attributes[0].trait_type);
    expect(json.attributes?.[0]?.value).to.be.eq(JSON_DATA.attributes[0].value);
  });
});