const hre = require("hardhat");

async function main() {
  const Owl = await hre.ethers.getContractFactory("owl_base");
  const owl = await hre.upgrades.deployProxy(Owl);
  await owl.deployed();
  console.log("Box deployed to:", owl.address);

  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
