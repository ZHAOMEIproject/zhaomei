var hre = require("hardhat");
var { writer_info_all } = require('./tool/hh_log.js');

// npx hardhat verify 0x4a4A704A9CDc165eB6614150b98Ff5b74BCa61c1 --constructor-args ./other_info/arguments.js --network bnbtest

async function main(){
    var arguments=[];
    // WBNB
    var WBNB = await hre.ethers.getContractFactory("WBNB");
    // arguments = require('../other_info/arguments');
    var wbnb = await WBNB.deploy(
        // ...arguments
    );
    await wbnb.deployed();
    console.log("WBNB deployed to:", wbnb.address);
    var wbnbArtifact = await artifacts.readArtifact("WBNB");
    await writer_info_all(network,wbnbArtifact, wbnb,arguments);

    // ViiderFactory
    var ViiderFactory = await hre.ethers.getContractFactory("ViiderFactory");
    var ViiderFactory_arg = require('../other_info/ViiderFactory');
    arguments=ViiderFactory_arg;
    var viiderfactory = await ViiderFactory.deploy(
        ...arguments
    );
    await viiderfactory.deployed();
    console.log("ViiderFactory deployed to:", viiderfactory.address);
    var ViiderFactoryArtifact = await artifacts.readArtifact("ViiderFactory");
    await writer_info_all(network,ViiderFactoryArtifact, viiderfactory,arguments);

    var ViiderPairArtifact = await artifacts.readArtifact("ViiderPair");
    await writer_info_all(network,ViiderPairArtifact,viiderfactory,null);

    // ViiderRouter
    arguments=[viiderfactory.address,wbnb.address];
    var ViiderRouter = await hre.ethers.getContractFactory("ViiderRouter");
    var viiderrouter = await ViiderRouter.deploy(
        ...arguments
    );
    await viiderrouter.deployed();
    console.log("ViiderRouter deployed to:", viiderrouter.address);
    var ViiderRouterArtifact = await artifacts.readArtifact("ViiderRouter");
    await writer_info_all(network,ViiderRouterArtifact, viiderrouter,arguments);

    // TOKEN VIIDER
    arguments=[];
    var VIIDER = await hre.ethers.getContractFactory("VIIDER");
    var viider = await VIIDER.deploy(
        // ...arguments
    );
    await viider.deployed();
    console.log("VIIDER deployed to:", viider.address);
    var VIIDERArtifact = await artifacts.readArtifact("VIIDER");
    await writer_info_all(network,VIIDERArtifact, viider,arguments);

    // Testtoken
    arguments=[];
    var Testtoken = await hre.ethers.getContractFactory("Testtoken");
    var testtoken = await Testtoken.deploy(
        // ...arguments
    );
    await testtoken.deployed();
    console.log("Testtoken deployed to:", testtoken.address);
    var TesttokenArtifact = await artifacts.readArtifact("Testtoken");
    await writer_info_all(network,TesttokenArtifact, testtoken,arguments);
    

    // test init
    await viider.approve(viiderrouter.address,await viider.totalSupply());
    let [owner] = await ethers.getSigners();
    // console.log("testout",await viider.allowance(owner.address,viiderrouter.address));
    await testtoken.approve(viiderrouter.address,await viider.totalSupply());
    console.log("approve finish");
    await viiderrouter.addLiquidity(
        viider.address,
        testtoken.address,
        ethers.utils.parseUnits('1',18),
        ethers.utils.parseUnits('1',18),
        0,
        0,
        owner.address,
        9999999999
    );
    await viiderrouter.addLiquidityETH(
        viider.address,
        ethers.utils.parseUnits('1',18),
        0,
        0,
        owner.address,
        9999999999,
        {value:ethers.utils.parseUnits('1',18)}
    );
    console.log("addLiquidity finish");

}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});