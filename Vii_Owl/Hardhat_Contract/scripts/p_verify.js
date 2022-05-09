const hre = require("hardhat");
async function main() {
  await hre.run("verify:verify", {
    address: "0xE31c26797cECf2D2f2aEd3AE4900b1FF3fACaE6e",
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
