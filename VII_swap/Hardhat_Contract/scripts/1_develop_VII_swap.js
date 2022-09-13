var hre = require("hardhat");
var { writer_info_all } = require('./tool/hh_log.js');

// npx hardhat verify 0x4a4A704A9CDc165eB6614150b98Ff5b74BCa61c1 --constructor-args ./other_info/arguments.js --network bnbtest

async function main(){
  var WBNB = await hre.ethers.getContractFactory("WBNB");
  // var arguments = require('../other_info/arguments');
  var wbnb = await WBNB.deploy(
    // ...arguments
  );
  await wbnb.deployed();
  console.log("WBNB deployed to:", wbnb.address);
  var wbnbArtifact = await artifacts.readArtifact("WBNB");
  await writer_info_all(network,wbnbArtifact, wbnb,arguments);



  var ViiderFactory = await hre.ethers.getContractFactory("ViiderFactory");
  var ViiderFactory_arg = require('../other_info/ViiderFactory');
  var viiderfactory = await ViiderFactory.deploy(
    ...ViiderFactory_arg
  );
  viiderfactory.deployed();
  console.log("ViiderFactory deployed to:", viiderfactory.address);
  var ViiderFactoryArtifact = await artifacts.readArtifact("ViiderFactory");
  await writer_info_all(network,ViiderFactoryArtifact, viiderfactory,arguments);

  var ViiderRouter = await hre.ethers.getContractFactory("ViiderRouter");
  var viiderrouter = await ViiderRouter.deploy(
    viiderfactory.address,wbnb.address
  );
  viiderrouter.deployed();
  console.log("ViiderRouter deployed to:", viiderrouter.address);
  var ViiderRouterArtifact = await artifacts.readArtifact("ViiderRouter");
  await writer_info_all(network,ViiderRouterArtifact, viiderrouter,arguments);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});