// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const INITIAL_MINT_PRICE = 5550000000000000; // 0,00555 ETH in wei
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL
const ALPHABET_URL = process.env.ALPHABET_URL

module.exports = buildModule("AlphabetModule", (m) => {
  // Check https://hardhat.org/ignition/docs/guides/creating-modules for more details
  const alphabetUrl = m.getParameter("alphabetUrl", ALPHABET_URL);
  const githubRepo = m.getParameter("githubRepoUrl", GITHUB_REPO_URL);
  const mintPrice = m.getParameter("initialMintPrice", INITIAL_MINT_PRICE); // 0.01 ETH in wei

  const alphabet = m.contract("Alphabet", [alphabetUrl, githubRepo, mintPrice]);

  return { alphabet };
});