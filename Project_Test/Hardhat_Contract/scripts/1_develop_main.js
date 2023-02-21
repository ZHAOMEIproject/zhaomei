const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

async function main(){
  const Main = await hre.ethers.getContractFactory("main");
  const arguments = require('../other_info/arguments');
  const main = await Main.deploy(
    ...arguments
    );
  await main.deployed();
  console.log("Main deployed to:", main.address);
  let Artifact = await artifacts.readArtifact("main");
  await writer_info_all(network,Artifact, main,arguments);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });