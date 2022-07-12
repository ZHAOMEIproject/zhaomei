const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');

async function main(){
  let [owner, addr1, addr2] = await ethers.getSigners();
  const E_order = await hre.ethers.getContractFactory("E_order");
  const e_order = await E_order.connect(addr2).deploy({gasPrice: 20000000001});
  await e_order.deployed();
  console.log("E_order deployed to:", e_order.address);
  let Artifact = await artifacts.readArtifact("E_order");
  await writer_info_all(network,Artifact, e_order,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });