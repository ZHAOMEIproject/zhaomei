var hre = require("hardhat");
var { writer_info_all } = require('./tool/hh_log.js');
// npx hardhat run scripts/test.js --network zhaomei
// npx hardhat run scripts/test.js --network bnbtest
// npx hardhat run scripts/test.js --network hardhat
// npx hardhat verify 0x4a4A704A9CDc165eB6614150b98Ff5b74BCa61c1 --constructor-args ./other_info/arguments.js --network bnbtest

async function main(){
    // 工厂合约
    var viiderfactory;
    // 路由合约
    var viiderrouter;
    // 以下三个币，理论上都只是名字不同。本质是一样的，是erc20。
    var wbnb;//和本币ETH/BNB/TBNB锚定，与本币一比一兑换，目的是将本币转换为erc20.
    var viider;
    var testtoken;

    // 创建以上的合约
    {
        var arguments = [];
        // WBNB
        var WBNB = await hre.ethers.getContractFactory("WBNB");
        wbnb = await WBNB.deploy();
        await wbnb.deployed();
        console.log("WBNB deployed to:", wbnb.address);
        var wbnbArtifact = await artifacts.readArtifact("WBNB");
        await writer_info_all(network, wbnbArtifact, wbnb, arguments);
        // ViiderFactory
        var ViiderFactory = await hre.ethers.getContractFactory("ViiderFactory");
        var ViiderFactory_arg = require('../other_info/ViiderFactory');
        arguments = ViiderFactory_arg;
        viiderfactory = await ViiderFactory.deploy(...arguments);
        await viiderfactory.deployed();
        console.log("ViiderFactory deployed to:", viiderfactory.address);
        var ViiderFactoryArtifact = await artifacts.readArtifact("ViiderFactory");
        await writer_info_all(network, ViiderFactoryArtifact, viiderfactory, arguments);

        var ViiderPairArtifact = await artifacts.readArtifact("ViiderPair");
        await writer_info_all(network, ViiderPairArtifact, viiderfactory, null);

        // ViiderRouter
        arguments = [viiderfactory.address, wbnb.address];
        var ViiderRouter = await hre.ethers.getContractFactory("ViiderRouter");
        viiderrouter = await ViiderRouter.deploy(...arguments);
        await viiderrouter.deployed();
        await viiderrouter.deployed();
        console.log("ViiderRouter deployed to:", viiderrouter.address);
        var ViiderRouterArtifact = await artifacts.readArtifact("ViiderRouter");
        await writer_info_all(network, ViiderRouterArtifact, viiderrouter, arguments);


        // TOKEN VIIDER
        arguments = [];
        var VIIDER = await hre.ethers.getContractFactory("VIIDER");
        viider = await VIIDER.deploy();
        await viider.deployed();
        console.log("VIIDER deployed to:", viider.address);
        var VIIDERArtifact = await artifacts.readArtifact("VIIDER");
        await writer_info_all(network, VIIDERArtifact, viider, arguments);

        // Testtoken
        arguments = [];
        var Testtoken = await hre.ethers.getContractFactory("Testtoken");
        testtoken = await Testtoken.deploy();
        await testtoken.deployed();
        console.log("Testtoken deployed to:", testtoken.address);
        var TesttokenArtifact = await artifacts.readArtifact("Testtoken");
        await writer_info_all(network, TesttokenArtifact, testtoken, arguments);
    }
    let [owner] = await ethers.getSigners();
    // 创建viider和testtoken的pool以及viider和本币(ETH/BNB/TBNB)的pool
    {
        // 执行币的授权，本币(ETH/BNB/TBNB)不需要。
        // 一般都是要用多少授权多少，嫌麻烦可以一次性授权完。
        {
            await viider.approve(viiderrouter.address, await viider.totalSupply());
            await testtoken.approve(viiderrouter.address, await viider.totalSupply());
        }
        // 建viider和testtoken的池子
        // {
        //     A币
        //     B币
        //     A币数量
        //     B币数量
        //     减去滑点的A币数量
        //     减去滑点的B币数量
        //     收到池子份额的地址(一般就是交互的钱包地址)
        //     截止时间戳
        // }
        await viiderrouter.addLiquidity(
            viider.address,
            testtoken.address,
            ethers.utils.parseUnits('0.00001', 18),
            ethers.utils.parseUnits('0.00001', 18),
            0,
            0,
            owner.address,
            9999999999
        );
        // 建viider和本币的池子
        // {
        //     A币地址
        //     A币数量
        //     减去滑点的A币数量
        //     减去滑点的本币数量
        //     收到池子份额的地址(一般就是交互的钱包地址)
        //     截止时间戳
        //     value(本币数量)
        // }
        await viiderrouter.addLiquidityETH(
            viider.address,
            ethers.utils.parseUnits('0.00001', 18),
            0,
            0,
            owner.address,
            9999999999,
            { value: ethers.utils.parseUnits('0.00001', 18) }
        );
        // console.log("addLiquidity finish");
    }



    
    // 依据pancakeswap前端流程，按顺序执行
    {
        // 合约加载方式，ethers.js为案例,
        // {
        //     // 获取abi
        //     var VIIDERArtifact = await artifacts.readArtifact("VIIDER");
        //     viider = new ethers.Contract(viider.address, VIIDERArtifact.abi, network.config.provider).connect(owner)
        // }
        // web3.js版
        // {
        //     // 获取abi
        //     var VIIDERArtifact = await artifacts.readArtifact("VIIDER");
        //     viider = new web3.eth.Contract(viider.address, VIIDERArtifact.abi, network.config.provider).connect(owner)
        // }
        let gasPrice
        let huadian;
        let timeend;
        let pairadd;
        // 设置
        {
            // gasPrice
            gasPrice = 327464893;
            // 滑点
            huadian = 0.5 / 100;
            // 截止时间
            timeend = 9999999999 + 60 * 20;
        }
        // 兑换页面
        {
            // 显示,默认主币和viide以及余额
            {
                // BNB写死名称，余额接口
                // let owner = new ethers.Wallet(privateKey, provider);//加载钱包
                await ethers.provider.getBalance(owner.address);
                // 代币名称接口和余额接口
                await viider.symbol();
                viider.balanceOf(owner.address);
            }
            // 用户选择两种代币后，查询配对合约是否存在
            {
                pairadd = await viiderfactory.getPair(viider.address,testtoken.address);
                // 如果地址为0则没有创建，需要创建流动性。
                // 跳转到流动性页面
            }
            // 计算兑换值,以及各种显示数据并兑换。
            {
                // 根据花费viider币兑换testtoken
                // 放回结果说明：输入100，得到[100,25],代表花费100个viider可以换取25个testtoken
                let viider_in=100;
                let endinfo = await viiderrouter.getAmountsOut(viider_in, [viider.address, testtoken.address]);

                // 根据要兑换的viider币量，算出需要多少testtoken
                // 放回结果说明：输入100，得到[25,100],代表兑换400个viider需要25个testtoken
                let viide_out=100;
                await viiderrouter.getAmountsIn(viide_out, [testtoken.address, viider.address]);
                // 价格比例
                let bili = endinfo[0] / endinfo[1];
                // 最小获得量
                let miniout = Math.floor(endinfo[1] * (1 - huadian));
                // 流动性供应商费用
                let fee = viider_in * (3 / 1000);
                // 兑换前，先查询花费的代币授权额度是否充足（假设是viider）不够则需要授权
                {
                    // 执行币的授权，本币(ETH/BNB/TBNB)不需要。
                    // 一般都是要用多少授权多少，嫌麻烦可以一次性授权完。
                    await viider.allowance(owner.address, viiderrouter.address);
                    await viider.approve(viiderrouter.address, await viider.totalSupply());
                    await testtoken.approve(viiderrouter.address, await viider.totalSupply());
                }
                // 兑换
                // swapExactTokensForTokensSupportingFeeOnTransferTokens
                // 拆分解析
                // swap ExactTokens For Tokens  SupportingFeeOnTransferTokens
                // 根据 准确的输入代币 兑换 输出代币  支持收税币
                // 币币兑换 viider换testtoken
                // {
                //     A币数量
                //     B币减去滑点后的最低可接受兑换数量
                //     兑换路径
                //     收款B币的地址
                //     时间戳
                // }
                // swapExactTokensForTokens
                // swapExactTokensForTokensSupportingFeeOnTransferTokens
                // 这两个方法的区别在于“SupportingFeeOnTransferTokens”可以让收税的币使用，不收税的也能使用。
                // 所以理论上直接用SupportingFeeOnTransferTokens的接口就好了。
                await viiderrouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    viider_in,
                    Math.floor(endinfo[1] * (1 - huadian)),
                    [viider.address, testtoken.address],
                    owner.address,
                    timeend,
                    { gasPrice: gasPrice }
                )
                // swap ExactETH For Tokens   SupportingFeeOnTransferTokens
                // 根据 准确的输入“本币” 兑换 输出代币  支持收税币
                // 本币兑换币 eth / BNB / TBNB 兑换 viider
                // {
                //     A币减去滑点后的最低可接受兑换数量
                //     兑换路径
                //     时间戳
                //     本币数量
                // }
                let bnb_in=10000;
                let getinfo = await viiderrouter.getAmountsOut(bnb_in, [wbnb.address, viider.address]);
                let in_info = Math.floor(getinfo[1] * (1 - huadian))

                await viiderrouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
                    in_info,
                    [wbnb.address, viider.address],
                    owner.address,
                    timeend,
                    { value: bnb_in, gasPrice: gasPrice }
                )
                // swap ExactTokens For ETH    SupportingFeeOnTransferTokens
                // 根据 准确的输入代币 兑换 输出“本币”  支持收税币
                // 代币兑换本币 viider 兑换 eth / BNB / TBNB
                // {
                //     A币数量
                //     本币减去滑点后的最低可接受兑换数量
                //     兑换路径
                //     时间戳
                // }
                await viiderrouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    viider_in,
                    Math.floor(endinfo[1] * (1 - huadian)),
                    [viider.address, wbnb.address],
                    owner.address,
                    timeend,
                    { gasPrice: gasPrice }
                )
            }
            
        }
        // 流动性页面
        {
            // 添加流动性
            {
                // 选择两种代币
                // 查询配对合约地址。
                // 如果为空，则是第一个流动性供应商
                let viider_in=100;
                let testtoken_in=100;
                {
                    // 执行前，先查询花费的代币授权额度是否充足（假设是viider）不够则需要授权
                    {
                        // 执行币的授权，本币(ETH/BNB/TBNB)不需要。
                        // 一般都是要用多少授权多少，嫌麻烦可以一次性授权完。
                        await viider.allowance(owner.address, viiderrouter.address);
                        await viider.approve(viiderrouter.address, await viider.totalSupply());
                        await testtoken.approve(viiderrouter.address, await viider.totalSupply());
                    }
                    // 两个币都是erc20时
                    // {
                    //     A币
                    //     B币
                    //     A币数量
                    //     B币数量
                    //     减去滑点的A币数量
                    //     减去滑点的B币数量
                    //     收到池子份额的地址(一般就是交互的钱包地址)
                    //     截止时间戳
                    // }
                    await viiderrouter.addLiquidity(
                        viider.address,
                        testtoken.address,
                        viider_in,
                        testtoken_in,
                        Math.floor(viider_in * (1 - huadian)),
                        Math.floor(testtoken_in * (1 - huadian)),
                        owner.address,
                        timeend
                    )
                    // 其中一个币是本币时
                    // {
                    //     A币地址
                    //     A币数量
                    //     减去滑点的A币数量
                    //     减去滑点的本币数量
                    //     收到池子份额的地址(一般就是交互的钱包地址)
                    //     截止时间戳
                    //     value(本币数量)
                    // }
                    let bnb_in=100;
                    await viiderrouter.addLiquidityETH(
                        viider.address,
                        viider_in,
                        Math.floor(viider_in * (1 - huadian)),
                        Math.floor(bnb_in * (1 - huadian)),
                        owner.address,
                        9999999999,
                        { value: bnb_in }
                    );
                }
                // 如果不为空
                {
                    // 两种币，如果有本币，则将地址换成wbnb的。
                    // 需要先获取配对合约在两种币的余额,得出比例
                    {
                        await viider.balanceOf(pairadd);
                        await testtoken.balanceOf(pairadd);
                    }
                    // 必须是按比例输入两种币添加份额。
                    // 两个币都是erc20时
                    // {
                    //     A币
                    //     B币
                    //     A币数量
                    //     B币数量
                    //     减去滑点的A币数量
                    //     减去滑点的B币数量
                    //     收到池子份额的地址(一般就是交互的钱包地址)
                    //     截止时间戳
                    // }
                    await viiderrouter.addLiquidity(
                        viider.address,
                        testtoken.address,
                        viider_in,
                        testtoken_in,
                        Math.floor(viider_in * (1 - huadian)),
                        Math.floor(testtoken_in * (1 - huadian)),
                        owner.address,
                        timeend
                    )
                    // 其中一个币是本币时
                    // {
                    //     A币地址
                    //     A币数量
                    //     减去滑点的A币数量
                    //     减去滑点的本币数量
                    //     收到池子份额的地址(一般就是交互的钱包地址)
                    //     截止时间戳
                    //     value(本币数量)
                    // }
                    let bnb_in = 100;
                    await viiderrouter.addLiquidityETH(
                        viider.address,
                        viider_in,
                        Math.floor(viider_in * (1 - huadian)),
                        Math.floor(bnb_in * (1 - huadian)),
                        owner.address,
                        9999999999,
                        { value: bnb_in }
                    );

                }
            }
            // 查找其他LP代币,查找到的存到本地缓存并展示在流动性页面
            {
                let pairadd = await viiderfactory.getPair(viider.address, testtoken.address);
                // 加载配对合约
                let ViiderPairArtifact = await artifacts.readArtifact("ViiderPair");
                pair = new ethers.Contract(pairadd, ViiderPairArtifact.abi, network.config.provider).connect(owner);
                // 拥有多少量
                let pairbalance = await pair.balanceOf(owner.address);
                let totalSupply = await pair.totalSupply();
                // console.log(pairbalance, totalSupply);
                // 占比多少
                let zhanbi = pairbalance / totalSupply;
                // 加载两种代币，查配对合约的总余额有多少。
                let pair_a_balance = await viider.balanceOf(pairadd);
                let pair_b_balance = await testtoken.balanceOf(pairadd);
                // 计算用户占的额度
                let user_a_balance = pair_a_balance * zhanbi;
                let user_b_balance = pair_b_balance * zhanbi; 
            }
            // 移除流动性
            {
                let pairadd = await viiderfactory.getPair(viider.address, testtoken.address);
                // 加载配对合约
                let ViiderPairArtifact = await artifacts.readArtifact("ViiderPair");
                pair = new ethers.Contract(pairadd, ViiderPairArtifact.abi, network.config.provider).connect(owner);

                await pair.approve(viiderrouter.address,"6000000");
                await viiderrouter.removeLiquidity(viider.address, testtoken.address,"6000000",?,?,owner.address,99999999);


            }

        }
        

    }
    
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});