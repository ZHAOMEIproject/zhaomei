const hre = require("hardhat");
async function main() {
  const [owner,addr1] = await ethers.getSigners();
  const balance0ETH =await hre.waffle.provider.getBalance(owner.address);
  console.log(balance0ETH.BigNumber);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });