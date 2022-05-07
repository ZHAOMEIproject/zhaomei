const hre = require("hardhat");
const { writeAddr, writeAbiAddr} = require('./artifact_log.js');

async function main() {
  await hre.run('compile');

  const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
  const token = await MyERC20.deploy();

  await token.deployed();
  let Artifact = await artifacts.readArtifact("MyERC20");
  console.log("MyERC20 deployed to:", token.address);
  // await writeAddr(token.address, "MyERC20", network.name)
  await writeAbiAddr(Artifact, token.address, "MyERC20", network.name)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
