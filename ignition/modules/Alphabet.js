// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const INITIAL_MINT_PRICE = 5550000000000000; // 0,00555 ETH in wei
const GITHUB_REPO_URL = "https://github.com/geralm/triangles-cypher-nft.git"
const ALPHABET_URL = "https://indigo-genuine-chameleon-200.mypinata.cloud/ipfs/bafkreibkizi2veefvnakwb47hdq454h5aqk7vfwj3uxaw6kluxagin6xre"

module.exports = buildModule("AlphabetModule", (m) => {
  // Check https://hardhat.org/ignition/docs/guides/creating-modules for more details
  const alphabetUrl = m.getParameter("alphabetUrl", ALPHABET_URL);
  const githubRepo = m.getParameter("githubRepoUrl", GITHUB_REPO_URL);
  const mintPrice = m.getParameter("initialMintPrice", INITIAL_MINT_PRICE); // 0.01 ETH in wei

  const alphabet = m.contract("Alphabet", [alphabetUrl, githubRepo, mintPrice]);

  return { alphabet };
});