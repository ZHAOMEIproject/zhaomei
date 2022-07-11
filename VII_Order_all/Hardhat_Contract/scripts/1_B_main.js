const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');

async function main(){
  let [owner, addr1, addr2] = await ethers.getSigners();
  const B_order = await hre.ethers.getContractFactory("B_order");
  const b_order = await B_order.connect(addr2).deploy({gasPrice: 5000000001});
  await b_order.deployed();
  console.log("B_order deployed to:", b_order.address);
  let Artifact = await artifacts.readArtifact("B_order");
  await writer_info_all(network,Artifact, b_order,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });