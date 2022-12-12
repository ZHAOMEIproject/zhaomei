var hre = require("hardhat");
var { writer_info_all } = require('./tool/hh_log.js');
// npx hardhat run scripts/2_test.js --network bnbtest
// npx hardhat run scripts/test.js --network bnbtest
// npx hardhat run scripts/test.js --network hardhat
// npx hardhat verify 0x4a4A704A9CDc165eB6614150b98Ff5b74BCa61c1 --constructor-args ./other_info/arguments.js --network bnbtest

async function main() {
    let [owner] = await ethers.getSigners();
    console.log(owner);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });