const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
async function main() {
  const Owl_base = require(`../deployments/${network.name}/owl_base.json`);

  const Owl_p = await hre.ethers.getContractFactory("owl_p");
  const owl_p = await Owl_p.deploy(Owl_base.address,"0x8129fc1c");
  await owl_p.deployed();
  console.log("Owl_p deployed to:", owl_p.address);
  let Artifact = await artifacts.readArtifact("owl_p");
  await writer_info(network,Artifact, owl_p.address);
  // await hre.run("verify:verify", {
  //   address: Owl_base.address,
  //   constructorArguments: [
  //   ],
  // })
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
