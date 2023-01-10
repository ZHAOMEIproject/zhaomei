const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const { getcontractinfo } = require('./tool/readcontracts');
// npx hardhat run scripts/1_develop_main.js --network dev
// npx hardhat run scripts/1_develop_main.js --network zhaomei
// npx hardhat run scripts/1_develop_main.js --network polygonMumbai
// npx hardhat verify 0x574A53FD5250747f10037Aa5f578940eA5c8B38d --network zhaomei
async function main() {
    // 加载hardhat.config.js设置的钱包
    let [owner, addr1, addr2] = await ethers.getSigners();
    await owner.sendTransaction({
        to: "0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1",
        value: ethers.utils.parseEther("1") // 1 ether
    })
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });