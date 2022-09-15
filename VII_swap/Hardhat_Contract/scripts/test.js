var hre = require("hardhat");
var { writer_info_all } = require('./tool/hh_log.js');

// npx hardhat verify 0x4a4A704A9CDc165eB6614150b98Ff5b74BCa61c1 --constructor-args ./other_info/arguments.js --network bnbtest

async function main(){
    var Test = await artifacts.readArtifact("ViiderPair");
    console.log(Test.abi);
    // console.log(ethers.utils.parseUnits('1',18));
    // console.log("testout",await viider.allowance(owner,viiderrouter.address));


    

}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});