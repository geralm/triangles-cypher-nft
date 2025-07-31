require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
   gasReporter: {
    currency: 'USD',
    etherscan: process.env.ETHERSCAN_API_KEY,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  networks: {
    /*sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_WORKSPACE_ID}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },*/
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_WORKSPACE_ID}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
};
