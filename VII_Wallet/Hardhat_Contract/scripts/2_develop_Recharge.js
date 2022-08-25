const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

// npx hardhat verify 0x439400D2D51f160eB8C441d4a2BB5Bb3038b3cCA --constructor-args ./other_info/arguments.js --network bnbtest
async function main(){
  const load = await hre.ethers.getContractFactory("Transfer_station");
  const arguments = require('../other_info/recharge');

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