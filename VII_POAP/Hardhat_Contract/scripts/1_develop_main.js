const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

// npx hardhat verify 0xB9E986e737A93065eF8171A8cC06c6E9FF3Ed4fa --constructor-args ./other_info/arguments.js --network goerli
async function main(){
  const Main_contract = await hre.ethers.getContractFactory("VII_POAP");
  const arguments = require('../other_info/arguments');
  const main_contract = await Main_contract.deploy(
    // ...arguments
    );
  await main_contract.deployed();
  console.log("Main_contract deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact("VII_POAP");
  await writer_info_all(network,Artifact, main_contract,arguments);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });