const hre = require("hardhat");
const { writer_info } = require('./tool/hh_log.js');
async function main() {
  // .connect(addr1)
  const VII_s = await hre.ethers.getContractFactory("vii_s");
  const vii_s = await VII_s.deploy();
  // const vii_s = await VII_s.connect(addr1).deploy();

  await vii_s.deployed();

  console.log("VII_s deployed to:", vii_s.address);
  let Artifact = await artifacts.readArtifact("vii_s");
  await writer_info(network,Artifact, vii_s,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
