const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const Owl_p = await hre.ethers.getContractFactory("owl_p");
  const owl_p = await Owl_p.deploy("0x4Cb1653C7aac7c9eb04CB5A49210ec89882d2FF9");

  await owl_p.deployed();

  console.log("Owl_p deployed to:", owl_p.address);
  let Artifact = await artifacts.readArtifact("owl_p");
  await writer_info(network,Artifact, owl_p.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
