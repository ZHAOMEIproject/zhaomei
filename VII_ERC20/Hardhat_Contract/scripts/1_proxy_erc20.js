const hre = require("hardhat");
const {upgrades} = require("hardhat");
const { writer_info_all_proxy } = require('./hh_log.js');
async function main() {
    const VII_ERC20_base = await hre.ethers.getContractFactory("Viide");
    const vii_erc20 = await upgrades.deployProxy(VII_ERC20_base);
    await vii_erc20.deployed();
    let Artifact = await artifacts.readArtifact("Viide");
    const c_Address = await hre.upgrades.erc1967.getImplementationAddress(vii_erc20.address);
    await writer_info_all_proxy(network,Artifact, vii_erc20.address,"",c_Address);
    console.log("VII_ERC20_base deployed to:", c_Address);
    console.log("VII_ERC20 deployed to:", vii_erc20.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });