const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');
// npx hardhat run scripts/1_develop_main.js --network dev
// npx hardhat run scripts/1_develop_main.js --network zhaomei
// npx hardhat run scripts/1_develop_main.js --network polygonMumbai
// npx hardhat run scripts/1_develop_main.js --network hardhat
// npx hardhat verify 0x64a4fD27B4Ae0c6546D3E6DFCB74F5ee82Fe74b0 --network zhaomei
async function main(){
  // 加载hardhat.config.js设置的钱包
  let [owner, addr1, addr2] = await ethers.getSigners();
  // console.log(owner.address);
  const Main_con = await hre.ethers.getContractFactory("WEIDONG");
  // const arguments = require('../other_info/arguments');

  const main_con = await Main_con.deploy(
    // ...arguments
    );
  await main_con.deployed();
  console.log("Main_con deployed to:", main_con.address);
  let Artifact = await artifacts.readArtifact("WEIDONG");
  await writer_info_all(network,Artifact, main_con,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });