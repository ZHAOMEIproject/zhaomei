const hre = require("hardhat");
const { writer_info } = require('./hh_log.js');
var Owl_base;
var Owl_p;
async function main() {
    Owl_base = require(`../deployments/${network.name}/owl_base.json`);
    Owl_p = await hre.ethers.getContractFactory("owl_p");
    await no1().then(no2());
}
async function no1(){
    const owl_p = await Owl_p.deploy(Owl_base.address,"0x8129fc1c");
    await owl_p.deployed();
    console.log("Owl_p deployed to:", owl_p.address);
}
async function no2(){
    await hre.run("verify:verify", {
        address: Owl_base.address,
        constructorArguments: Owl_base.constructorArguments,
    })
    await hre.run("verify:verify", {
        address: owl_p.address,
        constructorArguments: Owl_base.constructorArguments,
    })
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });