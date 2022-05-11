const hre = require("hardhat");
const { writer_info_all_proxy } = require('./hh_log.js');
const Owl_p = require(`../deployments/${network.name}/owl_base.json`);
async function main() {
  const owl_baseV2 = await ethers.getContractFactory("owl_base");
  const owl = await upgrades.upgradeProxy(Owl_p.address, owl_baseV2);
  const c_Address = await upgrades.erc1967.getImplementationAddress(owl.address);
  let Artifact = await artifacts.readArtifact("owl_base");
  await writer_info_all_proxy(network,Artifact, owl.address,"",c_Address);
  await owl.deployed();
  let updatetx = owl.update();
  updatetx.wait();
  console.log("owl new base:",c_Address);
  console.log("tx",owl.tx);
  console.log("owl update:",updatetx.tx);
  console.log("owl upgraded");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });