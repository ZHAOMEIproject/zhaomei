// 加载别的钱包
var path = "m/44'/60'/0'/9/9";// 第99号钱包
var secret = require("../../../../privateinfo/.secret.json");// 载入助记词
const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

// 加载hardhat.config.js设置的钱包
let [owner, addr1, addr2] = await ethers.getSigners();

// 访问接口获得数据
let info = await getbyurl("http://173.249.198.20:10908/v1/freemint/gethotlist");
console.log(info);

// 和合约交互，输入（秘钥，区块链网络id,合约名字，合约方法，合约交互的参数）
let getinfo = await contractcall(account._signingKey(),"97","TB_order","owner",[]);
console.log(getinfo);

// 添加合约模型（未加载地址的合约）
// 按照contractinfo = await getcontractinfo();获得的例子进行添加，不需要第一，二层的chainId和contractName。
contractadd(newontract);

