const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
  let Artifact = await artifacts.readArtifact("Greeter");
  await writer_info(network,Artifact, greeter.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
