const hre = require("hardhat");
// const Owl_p = require(`../../deployments/${network.name}/owl_base.json`);
const {getcontractinfo}=require('./tool/id-readcontracts');


async function main() {
  let loadinfo = await getcontractinfo();
  loadinfo=loadinfo[network.config.chainId.toString()];
  // console.log(loadinfo);

  for(let i in loadinfo){
    await hre.run("verify:verify", {
      address: loadinfo[i].address,
      constructorArguments: loadinfo[i].constructorArguments,
    })
  }

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
