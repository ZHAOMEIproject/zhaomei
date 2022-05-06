const hre = require("hardhat");
const { writeAbiAddr} = require('./artifact_log.js');
async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
  let Artifact = await artifacts.readArtifact("Greeter");
  await writeAbiAddr(Artifact, greeter.address, "Greeter", network.name);
  // await hre.run("verify:verify", {
  //   address: greeter.address,
  //   constructorArguments: [
  //     "Hello, Hardhat!",
  //   ],
  // })
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
