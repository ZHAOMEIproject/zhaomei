const hre = require("hardhat");
const { writer_info_all_proxy } = require('./tool/hh_log.js');
async function main() {
    const VII_FRAME_base = await hre.ethers.getContractFactory("vii_frame");
    const vii_frame = await hre.upgrades.deployProxy(VII_FRAME_base);
    await vii_frame.deployed();
    let Artifact = await artifacts.readArtifact("vii_frame");
    const c_Address = await upgrades.erc1967.getImplementationAddress(vii_frame.address);
    await writer_info_all_proxy(network,Artifact, vii_frame,"",c_Address);
    console.log("VII_FRAME_base deployed to:", c_Address);
    console.log("VII_FRAME deployed to:", vii_frame.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });