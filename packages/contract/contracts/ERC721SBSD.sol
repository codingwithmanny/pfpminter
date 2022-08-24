// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Imports
import "./ERC165.sol";
import "./IERC721.sol";
import "./IERC721Metadata.sol";

// Contract
/**
 * @dev ERC721 Soulbound Signature Drop NFT - Also known as a Non-Transferable One-Of-One NFT
 */
contract ERC721SBSD is ERC165, IERC721, IERC721Metadata {
    // Errors
    error ZeroAddressError();
    error NotApprovedOrOwner();
    error NonExistentToken();

    // Public Variables
    address public holder;
    string public baseURI;

    // Private Variables
    string private _name;
    string private _symbol;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address holder_
    ) {
        _name = name_;
        _symbol = symbol_;
        holder = holder_;
        baseURI = baseURI_;
        _mint(holder, 1); // Only tokenId which can be minted
    }

    // =============================================================
    //                       CUSTOM FUNCTIONS
    // =============================================================
    /**
     * @dev Allows for minting
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Allows for burning
     */
    function _burn(uint256 tokenId) internal virtual {
        if (!_exists(tokenId)) revert NonExistentToken();
        if (holder != msg.sender) revert NotApprovedOrOwner();
        holder = address(0);
        emit Transfer(msg.sender, address(0), tokenId);
    }

    /**
     * @dev Only allows one token to exist.
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return tokenId == 1;
    }

    /**
     * @dev Public burnable function - cannot be undone
     */
    function burn(uint256 tokenId) public virtual {
        _burn(tokenId);
    }

    // =============================================================
    //                            IERC165
    // =============================================================
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // =============================================================
    //                            IERC721
    // =============================================================
    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner)
        public
        view
        virtual
        override
        returns (uint256)
    {
        if (owner == address(0)) revert ZeroAddressError();
        return owner == holder ? 1 : 0;
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        return tokenId == 1 ? holder : address(0);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
    {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (!_exists(tokenId)) revert NonExistentToken();
        return holder;
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator)
        public
        view
        virtual
        override
        returns (bool)
    {
        revert NotApprovedOrOwner();
    }

    // =============================================================
    //                        IERC721Metadata
    // =============================================================
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert NonExistentToken();

        return string(abi.encodePacked(baseURI));
    }
}
