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
const secretinfo =require(`/root/learn/github/privateinfo/.secret.json`);
const infrakey='';
const scankey='';

module.exports = {
  defaultNetwork: "polygonMumbai",
  solidity:{
    compilers:[
      {
        version: "0.8.15",
        settings:{
          optimizer:{
            enabled:true,
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
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    oktest:{
      url:"https://exchaintestrpc.okex.org",
      chainId:65,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    bnbtest:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId:97,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    rinkeby:{
      url:"https://rinkeby.infura.io/v3/0c9313b9207a451cae987a85d13e9707",
      chainId:4,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    ropsten:{
      url:"https://ropsten.infura.io/v3/8cccc98026714be18a4052434bb4ae77",
      chainId:3,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    polygonMumbai:{
      url:"https://matic-mumbai.chainstacklabs.com",
      chainId:80001,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },
    },
    zhaomei:{
      url:"http://154.91.156.113:8545",
      chainId:7156777,
      accounts:{
        mnemonic:secretinfo.solidity.mnemonic,
      },

    }
  },
  etherscan:{
    apiKey:secretinfo.solidity.apiKey
  }
};