const hre = require("hardhat");
// const web3 = require("@nomiclabs/hardhat-web3");
async function main() {
    const [owner, addr1] = await hre.ethers.getSigners();
    console.log(await hre.web3);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });