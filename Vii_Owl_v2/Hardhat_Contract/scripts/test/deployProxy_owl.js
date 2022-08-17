const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');

const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
async function main() {
    // const Owl = await hre.ethers.getContractFactory("owl_base");
    // const owl = await hre.upgrades.deployProxy(Owl);
    // console.log(owl);
    // await owl.deployed();
    // let Artifact = await artifacts.readArtifact("owl_base");
    // await writer_info(network,Artifact, owl.address);
    const Owl = await artifacts.readArtifact("owl_base");

    const deploymentPath = path.resolve(__dirname, `../scripts`);
    var dir = deploymentPath+`/test.json`;
    await writeFile(dir, JSON.stringify(Owl, null, 2));
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
