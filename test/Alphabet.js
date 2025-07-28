const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const ALPHABET_URL = "https://example.com/alphabet.json";
const GITHUB_REPO_URL = "https://github.com/geralm/triangles-cypher-nft.git";

describe("Alphabet", function () {
  async function deployAlphabetFixture() {
    const [owner, other] = await ethers.getSigners();

    const Alphabet = await ethers.getContractFactory("Alphabet");
    const contract = await Alphabet.deploy(
      ALPHABET_URL,
      GITHUB_REPO_URL,
      ethers.parseEther("0.00555")
    );

    return { contract, owner, other };
  }

  describe("Deployment", function () {
    it("Should set the correct URLs and owner", async function () {
      const { contract, owner } = await loadFixture(deployAlphabetFixture);
      expect(await contract.baseAlphabetUrl()).to.equal(ALPHABET_URL);
      expect(await contract.githubRepositoryUrl()).to.equal(GITHUB_REPO_URL);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the correct initial mint price", async function () {
      const { contract } = await loadFixture(deployAlphabetFixture);
      expect(await contract.mintPrice()).to.equal(ethers.parseEther("0.00555"));
    });
  });

  describe("Minting", function () {
    it("Should mint successfully with sufficient payment", async function () {
      const { contract, owner } = await loadFixture(deployAlphabetFixture);
      const tx = await contract.mintAlphabet("ipfs://example1", {
        value: ethers.parseEther("0.00555"),
      });

      await expect(tx)
        .to.emit(contract, "AlphabetMinted")
        .withArgs(owner.address, 0, "ipfs://example1");

      expect(await contract.tokenURI(0)).to.equal("ipfs://example1");
    });

    it("Should revert if not enough ETH is sent", async function () {
      const { contract } = await loadFixture(deployAlphabetFixture);
      await expect(
        contract.mintAlphabet("ipfs://fail", {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Donations", function () {
    it("Should accept donations and emit event", async function () {
      const { contract, owner } = await loadFixture(deployAlphabetFixture);
      const donationAmount = ethers.parseEther("0.01");

      await expect(contract.donate("Gracias por el proyecto!", {
        value: donationAmount,
      }))
        .to.emit(contract, "DonationReceived")
        .withArgs(owner.address, donationAmount, "Gracias por el proyecto!");
    });

    it("Should increase totalDonated", async function () {
      const { contract } = await loadFixture(deployAlphabetFixture);
      const donationAmount = ethers.parseEther("0.01");

      await contract.donate("Gracias!", { value: donationAmount });
      expect(await contract.totalDonated()).to.equal(donationAmount);
    });
  });

  describe("Withdrawals", function () {
    it("Should allow owner to withdraw donations", async function () {
      const { contract, owner } = await loadFixture(deployAlphabetFixture);
      const donationAmount = ethers.parseEther("0.02");

      // Donate first
      await contract.donate("Test withdrawal", { value: donationAmount });

      // Withdraw
      await expect(() => contract.withdraw()).to.changeEtherBalances(
        [owner, contract],
        [donationAmount, -donationAmount]
      );
    });

    it("Should revert withdraw if no balance", async function () {
      const { contract } = await loadFixture(deployAlphabetFixture);
      await expect(contract.withdraw()).to.be.revertedWith("No funds to withdraw");
    });
  });
});
