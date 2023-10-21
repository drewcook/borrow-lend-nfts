// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LendNFT is ERC721 {
    // Used as a counter for token IDs
    uint256 private s_tokenCounter;
    // Store token ID URIs
    mapping(uint256 => string) private s_tokenIdToUri;

    constructor() ERC721("LendNFT", "LEND") {
        s_tokenCounter = 1;
    }

    // ALlows minters to choose their own token URI, mint them the current token ID and increment it by 1
    function mint(string memory _tokenUri) public {
        s_tokenIdToUri[s_tokenCounter] = _tokenUri;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return s_tokenIdToUri[_tokenId];
    }
}
