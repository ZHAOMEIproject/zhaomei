// 安装环境
// npm install & npm install hardhat --save
// 运行测试服务
// npx hardhat run testscripts/test.js --network hardhat
// (tip: --network 选择链，参考文档.secret.json)


// 加载别的钱包
var path = "m/44'/60'/0'/9/9";// 第99号钱包
var secret = require("D:/zhaomei/.secret.json");// 载入很多信息
const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

// 加载hardhat.config.js设置的钱包
let [owner, addr1, addr2] = await ethers.getSigners();

// 获取项目的合约信息
contractinfo = await getcontractinfo();
console.log(contractinfo);

// 访问接口获得json数据
getbyurl(url);
let info = await getbyurl("http://173.249.198.20:10908/v1/freemint/gethotlist");
console.log(info);

// 和合约交互，输入（秘钥，区块链网络id,合约名字，合约方法，合约交互的参数）
let getinfo = await call_contract(account._signingKey(),"97","TB_order","owner",[]);
console.log(getinfo);

// 与--network的合约交互（加载好的账号，合约名字，合约方法，合约交互参数）
let getinfo = await l_call_contract(owner,"TB_order","owner",[])
console.log(getinfo);

// 创建合约（秘钥，链名字，合约名字，合约创建需要添加的参数）
// （创建合约后，推荐运行getcontractinfo()重新获取合约信息）
await creat_contract(signingKey,chain_name,contractname,arguments)

// 在--network创建合约（加载好的账号，合约名字，合约创建需要添加的参数）
// （创建合约后，推荐运行getcontractinfo()重新获取合约信息）
await l_creat_contract(owner,"Greeter",["test"]);


// 添加合约模型（未加载地址的合约）
// 按照contractinfo = await getcontractinfo();获得的例子进行添加，不需要第一，二层的chainId和contractName。
contractadd(newontract);

// 等待一秒
await wait(1000)