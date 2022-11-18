const hre = require("hardhat");
const { writer_info } = require('./tool/hh_log.js');

// npx hardhat verify 0xB9E986e737A93065eF8171A8cC06c6E9FF3Ed4fa --constructor-args ./other_info/arguments.js --network goerli
async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);
  let Artifact = await artifacts.readArtifact("Greeter");
  await writer_info(network,Artifact, greeter);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
