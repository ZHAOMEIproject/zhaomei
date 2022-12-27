require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
const fs = require('fs');
// var secretinfo =fs.readFileSync("/home/ubuntu/zwj-learn/.secret.json").toString().trim();
const secretinfo = require(`/root/learn/github/privateinfo/.secret.json`);
// const secretinfo =require(`/root/learn/github/privateinfoWallet/.secret_official.json`);
const infrakey = '';
const scankey = '';

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
    overrides: {
      "contracts/ViiderFactory.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      "contracts/ViiderRouter.sol": {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      "contracts/WBNB.sol": {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    }
  },
  networks: secretinfo.hardhatset.networks,
  etherscan: secretinfo.hardhatset.etherscan
};