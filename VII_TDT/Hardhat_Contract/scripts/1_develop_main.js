const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

// npx hardhat verify 0x76e5469676BF5a03BCeC9a6e59743b4f1498eD2b --network polygonMumbai
async function main(){
  const Main_contract = await hre.ethers.getContractFactory("VII_POAP");
  const arguments = require('../other_info/arguments');
  const main_contract = await Main_contract.deploy(
    // ...arguments
    );
  await main_contract.deployed();
  console.log("Main_contract deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact("VII_POAP");
  // await writer_info_all(network,Artifact, main_contract,arguments);
  await writer_info_all(network,Artifact, main_contract,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });