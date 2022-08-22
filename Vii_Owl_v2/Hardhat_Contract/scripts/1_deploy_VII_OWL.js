const hre = require("hardhat");
const { writer_info } = require('./tool/hh_log.js');
async function main() {
  // .connect(addr1)
  const VII_owl = await hre.ethers.getContractFactory("VII_OWL");
  const vii_owl = await VII_owl.deploy();
  // const vii_owl = await VII_owl.connect(addr1).deploy();

  await vii_owl.deployed();

  console.log("VII_owl deployed to:", vii_owl.address);
  let Artifact = await artifacts.readArtifact("VII_OWL");
  await writer_info(network,Artifact, vii_owl,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
