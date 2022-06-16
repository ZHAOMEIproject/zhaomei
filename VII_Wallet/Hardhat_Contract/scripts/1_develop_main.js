const hre = require("hardhat");
const { writer_info_all } = require('./hh_log.js');
async function main() {
  const Main_withdraw = await hre.ethers.getContractFactory("main_withdraw");
  const main_withdraw = await Main_withdraw.deploy(
    "Hello, Hardhat!");
  await main_withdraw.deployed();
  console.log("Main_withdraw deployed to:", main_withdraw.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
