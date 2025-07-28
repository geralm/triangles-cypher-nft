// SPDX-License-Identifier: MIT

// This contract provides a simple implementation of an NFT collection
// specifically designed for minting and managing a collection of alphabets.
// It allows users to mint their own alphabets, set a mint price, and manage ownership
// of the NFTs. The contract also includes donation functionality and allows the owner
// to withdraw funds collected from minting and donations.

pragma solidity ^0.8.20;

// Importing the Ownable contract from OpenZeppelin to manage ownership
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// Importing the ERC721 contract from OpenZeppelin to create an NFT
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Contract declaration
contract TrianglesAlphabet is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId; // check https://docs.openzeppelin.com/contracts/5.x/erc721 for more info
    uint256 public mintPrice; // minimun price to mint an alphabet NFT
    uint256 public totalDonated; // Obviosly.

    string public baseAlphabetUrl; // first alphabet linked to IPFS
    string public githubRepositoryUrl; // linked to GitHub repository

    // Two events to log minting and donation activities
    event AlphabetMinted(
        address indexed user,
        uint256 tokenId,
        string tokenURI
    );
    event DonationReceived(
        address indexed from,
        uint256 amount,
        string message
    );

    // Constructor to initialize the contract with base URLs and initial mint price
    // The constructor sets the baseAlphabetUrl, githubRepositoryUrl, and mintPrice.
    // It also initializes the ERC721 contract with a name and symbol.
    constructor(
        string memory _alphabetUrl,
        string memory _githubUrl,
        uint256 _initialMintPrice
    ) Ownable(msg.sender) ERC721("TrianglesAlphabet", "TRI") {
        baseAlphabetUrl = _alphabetUrl;
        githubRepositoryUrl = _githubUrl;
        mintPrice = _initialMintPrice; // Set the initial mint price
    }

    // donate and withdraw functions
    function donate(string memory message) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        totalDonated += msg.value; // Update the total donated amount
        emit DonationReceived(msg.sender, msg.value, message);
    }
    function withdraw() public onlyOwner {
        // Allows the owner to withdraw all funds from the contract
        // More information here: https://solidity-by-example.org/payable/
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // Minting function for creating a new alphabet NFT
    // This function allows users to mint a new alphabet NFT by providing a custom URI.
    function mintAlphabet(
        string memory customURI
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, customURI);

        emit AlphabetMinted(msg.sender, tokenId, customURI);
        return tokenId;
    }

    // Function to set the mint price, baseAlphabetUrl, and githubRepositoryUrl
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }
    function setBaseAlphabetUrl(
        string memory _newAlphabetUrl
    ) public onlyOwner {
        baseAlphabetUrl = _newAlphabetUrl; // Update the baseAlphabetUrl with the new value
    }
    function setGithubRepositoryUrl(
        string memory _newGithubRepositoryUrl
    ) public onlyOwner {
        githubRepositoryUrl = _newGithubRepositoryUrl; // Update the githubRepositoryUrl with the new value
    }
}
