const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
// const {contractadd,creatcontract} = require('./tool/testfun.js');
// 测试的help文档
// require('./help.js')

// 加载别的钱包
var path = "m/44'/60'/0'/9/9";// 第99号钱包
var secret = require("../../../../privateinfo/.secret.json");// 载入助记词
const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
var contractinfo = new Object();
async function main(){
  // 获取项目的合约信息
  // contractinfo = await getcontractinfo();
  // // console.log(contractinfo);
  // let getinfo = await contractcall(account._signingKey(),"97","Greeter","greet",[]);
  // creatcontract(account)


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});




// 合约交互
async function contractcall(signingKey,chainId,contractname,fun,params){
  let provider = new ethers.providers.JsonRpcProvider(contractinfo[chainId][contractname].network.url);
  let wallet = new ethers.Wallet(signingKey, provider);
  let contract = new ethers.Contract(
    contractinfo[chainId][contractname].address, 
    contractinfo[chainId][contractname].abi, 
    provider
  );
  let contractWithSigner = contract.connect(wallet);
  let tx;
  if(params.length>0){
    // tx = await contractWithSigner[fun](...params);
    // console.log(...params);
    tx = await contractWithSigner[fun](...params);
  }else{
    tx = await contractWithSigner[fun]();
  }
  return tx
}
// 加载新合约
function contractadd(newontract){
  contractinfo[newontract.network.chainId.toString()][newontract.contractName]=newontract;
}
// 创建新合约
async function creatcontract(signingKey,con_name,arguments){
  let provider = new ethers.providers.JsonRpcProvider();
  let wallet = new ethers.Wallet(signingKey, provider);

  const Mainwithdraw = await hre.ethers.getContractFactory(con_name);
  const mainwithdraw = await Mainwithdraw.connect(wallet).deploy(
    ...arguments
    );
  await mainwithdraw.deployed();
  console.log(con_name + " deployed to:", mainwithdraw.address);
  let Artifact = await artifacts.readArtifact(con_name);
  await writer_info_all(network,Artifact, mainwithdraw,arguments);
}