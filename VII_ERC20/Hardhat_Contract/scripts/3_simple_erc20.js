const hre = require("hardhat");
const { writer_info } = require('./tool/hh_log.js');
async function main() {
  // .connect(addr1)
  const Viide = await hre.ethers.getContractFactory("Viide");
  const viide = await Viide.deploy();
  // const viide = await Viide.connect(addr1).deploy();

  await viide.deployed();

  console.log("Viide deployed to:", viide.address);
  let Artifact = await artifacts.readArtifact("Viide");
  await writer_info(network,Artifact, viide,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
