// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Contract
/**
 * @dev ERC721 Soulbound Signature Drop NFT - Also known as a Non-Transferable One-Of-One NFT
 */
contract ERC721SBSD {
    // Events
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

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
    function supportsInterface(bytes4) public view virtual returns (bool) {
        return true;
    }

    // =============================================================
    //                            IERC721
    // =============================================================
    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual returns (uint256) {
        if (owner == address(0)) revert ZeroAddressError();
        return owner == holder ? 1 : 0;
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        return tokenId == 1 ? holder : address(0);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address, address, uint256) public virtual {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address, address, uint256) public virtual {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address, uint256) public virtual {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address, bool) public virtual {
        revert NotApprovedOrOwner();
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(
        uint256 tokenId
    ) public view virtual returns (address) {
        if (!_exists(tokenId)) revert NonExistentToken();
        return holder;
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(
        address,
        address
    ) public view virtual returns (bool) {
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
    function tokenURI(
        uint256 tokenId
    ) public view virtual returns (string memory) {
        if (!_exists(tokenId)) revert NonExistentToken();

        return string(abi.encodePacked(baseURI));
    }
}
