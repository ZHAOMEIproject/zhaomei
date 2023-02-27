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
const secretinfo =require(`../../../privateinfo/.secret.json`);
// const secretinfo =require(`../../../privateinfoPOAP/.secret_official.json`);
const infrakey='';
const scankey='';

module.exports = secretinfo.hardhatset;

