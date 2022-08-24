// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Imports
import "./IERC165.sol";

// Contract
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}