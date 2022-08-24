// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721SBSD.sol";

contract FactoryERC721SBSD {

    event NewERC721SBSD(string, string, address, address);

    function buildERC721SBSD(
        string memory name_, 
        string memory symbol_, 
        string memory baseURI_,
        address holder_
        ) public payable {
        ERC721SBSD erc721sbsd = new ERC721SBSD(name_, symbol_, baseURI_, holder_);
        emit NewERC721SBSD(name_, symbol_, holder_, address(erc721sbsd));
    }
}