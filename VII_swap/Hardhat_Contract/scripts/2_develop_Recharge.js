const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

// npx hardhat verify 0x7CeAdDF2287A6199e78787F1DFE42252B68998Fc --constructor-args other_info/rechange.js 
async function main(){
  const load = await hre.ethers.getContractFactory("Transfer_station");
  const arguments = require('../other_info/rechange');

  const deploy = await load.deploy(
    ...arguments
  );
  await deploy.deployed();
  console.log("Deploy deployed to:", deploy.address);
  let Artifact = await artifacts.readArtifact("Transfer_station");
  await writer_info_all(network,Artifact, deploy,arguments);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });