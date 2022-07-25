const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/readcontracts');

// npx hardhat verify 0x439400D2D51f160eB8C441d4a2BB5Bb3038b3cCA --constructor-args ./other_info/arguments.js --network bnbtest
async function main(){
  const Mainwithdraw = await hre.ethers.getContractFactory("mainwithdraw");
  const arguments = require('../other_info/arguments');
  const mainwithdraw = await Mainwithdraw.deploy(
    ...arguments
    );
  await mainwithdraw.deployed();
  console.log("Mainwithdraw deployed to:", mainwithdraw.address);
  let Artifact = await artifacts.readArtifact("mainwithdraw");
  await writer_info_all(network,Artifact, mainwithdraw,arguments);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });