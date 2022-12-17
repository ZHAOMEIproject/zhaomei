const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
const request = require("request");
const {getsign}=require("../../node/api/sign/getsign");

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/con_l_test.js --network hardhat
// npx hardhat run testscripts/con_l_test.js --network zhaomei
// (tip: --network 选择链，参考文档.secret.json)

var contractinfo = new Object();

async function main(){
    // 加载hardhat.config.js设置的钱包
    let [t,t1,t2,t3,t4,t5,t6,t7,owner, addr1, addr2] = await ethers.getSigners();
    // 获取项目的合约信息
    contractinfo = await getcontractinfo();
    let mintnumber = 2;
    let minttype=1;
    let signinfo = await getsign(
      network.config.chainId,"OOC",
      [
        owner.address,
        mintnumber,
        "9999999999",
        minttype
      ]
    );
    // console.log(signinfo);
    // await l_call_contract(
    //   owner,
    //   "OOC",
    //   "debugtime",
    //   [
    //     1671638300
    //   ]
    // );
    await t.sendTransaction({
      to: owner.address,
      value: ethers.utils.parseEther((0.05*(mintnumber+1)).toString()) // 1 ether
    })
    let getinfo = await l_call_contract(
      owner,
      "OOC",
      "OOC_mint",
      [
        0,
        [
          owner.address,
          mintnumber,
          "9999999999",
          minttype,
          ...Object.values(signinfo)
        ],
        mintnumber
      ],
      {
        value: await ethers.utils.parseEther((0.05*mintnumber).toString())
      }
    );
    
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

const { network } = require("hardhat");
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
