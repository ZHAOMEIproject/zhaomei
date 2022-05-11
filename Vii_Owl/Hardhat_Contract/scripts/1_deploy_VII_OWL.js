const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const VII_owl = await hre.ethers.getContractFactory("VII_OWL");
  const vii_owl = await VII_owl.deploy();

  await vii_owl.deployed();

  console.log("VII_owl deployed to:", vii_owl.address);
  let Artifact = await artifacts.readArtifact("VII_OWL");
  await writer_info(network,Artifact, vii_owl.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
