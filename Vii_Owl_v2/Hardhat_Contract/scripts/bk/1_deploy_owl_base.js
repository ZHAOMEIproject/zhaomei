const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const Owl_base = await hre.ethers.getContractFactory("owl_base");
  const owl_base = await Owl_base.deploy();

  await owl_base.deployed();

  console.log("Owl_base deployed to:", owl_base.address);
  let Artifact = await artifacts.readArtifact("owl_base");
  await writer_info(network,Artifact, owl_base.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
