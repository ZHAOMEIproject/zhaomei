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

require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
const fs = require('fs');
// var secretinfo =fs.readFileSync("/home/ubuntu/zwj-learn/.secret.json").toString().trim();
const secretinfo =require(`/home/ubuntu/zwj-learn/.secret.json`);
const infrakey='';
const scankey='';

module.exports = {
  solidity:{
    compilers:[
      {
        version: "0.8.7",
        setting:{
          optimizer:{
            enable:true,
            runs:200
          }
        }
      }
    ]
  },
  networks:{
    dev:{
      url:"http://127.0.0.1:8545",
      chainId:31337,
    },
    oktest:{
      url:"https://exchaintestrpc.okex.org",
      chainId:65,
      accounts:{
        mnemonic:secretinfo.mnemonic,
      },
    },
    bnbtest:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId:97,
      accounts:{
        mnemonic:secretinfo.mnemonic,
      },
    },
    ropsten:{
      url:"https://ropsten.infura.io/v3/8cccc98026714be18a4052434bb4ae77",
      chainId:3,
      accounts:{
        mnemonic:secretinfo.mnemonic,
      },
    },
    polygonMumbai:{
      url:"https://matic-mumbai.chainstacklabs.com",
      chainId:80001,
      accounts:{
        mnemonic:secretinfo.mnemonic,
      },
    }
  },
  etherscan:{
    apiKey:secretinfo.apiKey
  }
};