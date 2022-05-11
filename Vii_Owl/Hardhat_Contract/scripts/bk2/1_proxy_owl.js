const hre = require("hardhat");
const { writer_info_all_proxy } = require('./hh_log.js');

const fs = require('fs');
const path = require('path');
const util = require('util');
async function main() {
    const Owl = await hre.ethers.getContractFactory("owl_base");
    const owl = await hre.upgrades.deployProxy(Owl);
    await owl.deployed();
    let Artifact = await artifacts.readArtifact("owl_base");
    const c_Address = await upgrades.erc1967.getImplementationAddress(owl.address);
    await writer_info_all_proxy(network,Artifact, owl.address,"",c_Address);
    console.log("Owl_base deployed to:", c_Address);
    console.log("Owl deployed to:", owl.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });