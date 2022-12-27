const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');
const {getcontractinfo}=require('./tool/id-readcontracts');
// npx hardhat run scripts/1_develop_main.js --network polygonMumbai
// npx hardhat verify 0x4F2f5aa447914F2FF985e5f578BE3fCbadcE39e4 --network polygonMumbai
var contractinfo = new Object();
async function main(){
    // 加载hardhat.config.js设置的钱包
    contractinfo = await getcontractinfo();
    let [owner, addr1, addr2] = await ethers.getSigners();
    let getinfo = await l_call_contract(owner,"OOC","owner",[]);
    console.log(getinfo);
}
main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});

async function call_contract(signingKey,chainId,contractname,fun,params){
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
async function l_call_contract(wallet,contractname,fun,params,options){
    let contract = new ethers.Contract(
        contractinfo[network.config.chainId][contractname].address, 
        contractinfo[network.config.chainId][contractname].abi, 
        network.config.provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    //   console.log(params.length);
    if(params.length>0){
        // tx = await contractWithSigner[fun](...params);
        // console.log(...params);
        tx = await contractWithSigner[fun](...params,{...options});
    }else{
        tx = await contractWithSigner[fun]({...options});
    }
    return tx
  }