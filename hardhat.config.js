require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
   gasReporter: {
    currency: 'USD',
    etherscan: process.env.ETHERSCAN_API_KEY,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  }
};
