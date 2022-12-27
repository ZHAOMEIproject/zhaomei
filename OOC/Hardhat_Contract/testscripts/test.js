const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
const request = require("request");
const {getsign}=require("../../node/api/sign/getsign");
const { network } = require("hardhat");
const { ethers } = require("ethers");

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/test.js --network zhaomei
// (tip: --network 选择链，参考文档.secret.json)

var contractinfo = new Object();

async function main(){
  contractinfo = await getcontractinfo();
  var path = "m/44'/60'/0'/0/0";// 第99号钱包
  var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
  const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
  // let getinfo = await call_contract(
  //   account._signingKey(),
  //   "7156777","OOC","addsupportedBcns",
  //   [[["0xc8992606630e767fC7bdB0D7Eb7E4B2aA0a50363",3],["0xA15eB9cc57A4B0c5175dBCCa1775791826c68573",4]]]
  // )
    
  let input = new Array();
  input=[
      "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
      2,
      1672329600,
      1
  ]
  let sign_rq = await getsign(
    "7156777","OOC",
      [...input]
  )
  console.log(sign_rq);
  let getinfo = await call_contract(
    account._signingKey(),
    "7156777","OOC","signcheck",
    [
      [
        "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
        2,
        1672329600,
        1,
        ...Object.values(sign_rq)
      ]
    ]
  )
  console.log(getinfo);
  let otherinfo = await call_contract(
    account._signingKey(),
    "7156777","OOC","view_set",
    [
    ]
  )
  console.log(otherinfo);
}






















// 后面不用管

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

async function call_contract(signingKey,chainId,contractname,fun,params,options){
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
    tx = await contractWithSigner[fun](...params,{...options});
  }else{
    tx = await contractWithSigner[fun]({...options});
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
const { writer_info_all } = require('./tool/hh_log.js');
async function l_creat_contract(wallet,contractname,arguments){
  const Main_contract = await hre.ethers.getContractFactory(contractname);
  const main_contract = await Main_contract.connect(wallet).deploy(
    ...arguments
  );
  await main_contract.deployed();
  console.log(contractname+" deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact(contractname);
  await writer_info_all(network,Artifact, main_contract,arguments);
  contractinfo = await getcontractinfo();
}
async function creat_contract(signingKey,chain_name,contractname,arguments){
  let provider = new ethers.providers.JsonRpcProvider(secret.hardhatset.networks[chain_name].url);
  let wallet = new ethers.Wallet(signingKey, provider);

  const Main_contract = await hre.ethers.getContractFactory(contractname);
  const main_contract = await Main_contract.connect(wallet).deploy(
    ...arguments
  );
  await main_contract.deployed();
  console.log(contractname+" deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact(contractname);
  await writer_info_all(network,Artifact, main_contract,arguments);
  contractinfo = await getcontractinfo();
}

function contractadd(newontract){
  contractinfo[newontract.network.chainId.toString()][newontract.contractName]=newontract;
}

function getbyurl(url){
  return new Promise(function (resolve, reject) {
      request({
          timeout:10000,    // Set timeout
          method:'GET',     // Set method
          url:url
      },async function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // let body = JSON.parse(body);
              resolve(JSON.parse(body));
          }else{
              resolve();
          }
      })
  })
}

async function wait(ms){
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}
