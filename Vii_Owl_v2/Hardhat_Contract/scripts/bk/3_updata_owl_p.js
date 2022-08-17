const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const Owl_base = await hre.ethers.getContractFactory("owl_base");
  const owl_base = await Owl_base.deploy();
  await owl_base.deployed();
  console.log("Owl_base deployed to:", owl_base.address);
  let Artifact = await artifacts.readArtifact("owl_base");
  await writer_info(network,Artifact, owl_base.address);


  const Owl_p = require(`../deployments/${network.name}/owl_p.json`);
  const owl_p = await hre.ethers.getContractAt("owl_base",Owl_p.address);
  await owl_p.upgradeTo("0xF76436EE80D748eed6Ab0F7DFAb4700ba463009C");
  console.log("Finishing upgrade:",owl_p.hash);
  await hre.run("verify:verify", {
    address: owl_base.address,
    constructorArguments: [
    ],
  })
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
