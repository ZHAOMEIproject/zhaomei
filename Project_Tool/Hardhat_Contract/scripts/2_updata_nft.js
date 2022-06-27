const hre = require("hardhat");
const { writer_info_all_proxy } = require('./tool/hh_log.js');
const VII_ERC20_p = require(`../deployments/${network.name}/vii_erc20_base.json`);
async function main() {
  const vii_erc20_baseV2 = await ethers.getContractFactory("vii_erc20_base");
  const vii_erc20 = await upgrades.upgradeProxy(VII_ERC20_p.address, vii_erc20_baseV2);
  const c_Address = await upgrades.erc1967.getImplementationAddress(vii_erc20.address);
  let Artifact = await artifacts.readArtifact("vii_erc20_base");
  await writer_info_all_proxy(network,Artifact, vii_erc20.address,"",c_Address);
  await vii_erc20.deployed();
  let updatetx = vii_erc20.update();
  updatetx.wait();
  console.log("vii_erc20 new base:",c_Address);
  console.log("tx",vii_erc20.tx);
  console.log("vii_erc20 update:",updatetx.tx);
  console.log("vii_erc20 upgraded");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });