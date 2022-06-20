const hre = require("hardhat");
const Owl_p = require(`../../deployments/${network.name}/owl_base.json`);
async function main() {
  await hre.run("verify:verify", {
    address: Owl_p.p_address,
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
