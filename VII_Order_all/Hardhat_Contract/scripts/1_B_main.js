const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');

async function main(){
  const TB_order = await hre.ethers.getContractFactory("TB_order");
  const tb_order = await TB_order.deploy(
    );
  await tb_order.deployed();
  console.log("TB_order deployed to:", tb_order.address);
  let Artifact = await artifacts.readArtifact("TB_order");
  await writer_info_all(network,Artifact, tb_order,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });