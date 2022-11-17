const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
const request = require("request");

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/con_l_test.js --network hardhat
// (tip: --network 选择链，参考文档.secret.json)

var contractinfo = new Object();

async function main(){
    // 加载hardhat.config.js设置的钱包
    let [owner, addr1, addr2] = await ethers.getSigners();
    console.log(owner.address);
    console.log(await ethers.provider.getBalance(owner.address));
    return;
    // 获取项目的合约信息
    contractinfo = await getcontractinfo();
    await l_creat_contract(owner,"OOC",[]);
    // console.log(contractinfo);

    const gainerAddr="0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178";
    const tokenid=0;
    
    let getsign = await getbyurl('http://127.0.0.1:10909/V1/apigetsign/getsign?'
    +'id=31337'
    +'&contractname=OOC'
    +'&params={"gainer":"'+gainerAddr+'","community":"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","amount":"5","deadline":"9999999999","typemint":"0"}');
    // console.log(getsign);
    // console.log(...Object.values(getsign.data.result));
    // return
    // let get_setinfo =await l_call_contract(
    //     owner,
    //     "OOC",
    //     "view_set",
    //     []
    // );
    // console.log(get_setinfo);
    // return
   
   
    // beforetests
    {
      console.log("Before test query results:");
      try {     
        let getinfo2 = await l_call_contract(
          addr1,
          "OOC",
          "ownerOf",
          [
            0
          ]
        );        
        console.log(getinfo2);      }catch(err){
          console.log("钱包地址下无token，当前未mint");
        }
 
      let getinfo3 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
          gainerAddr
        ]
      );
      console.log(getinfo3);

      ownerAddrAmount=await ethers.provider.getBalance(owner.address);
      console.log("ownerAddrAmount:"+ownerAddrAmount);
      gainerAddrAmount=await ethers.provider.getBalance(addr1.address);
      console.log("gainerAddrAmount:"+gainerAddrAmount);
    }

  //debug
  {
    await l_call_contract(
      addr1,
      "OOC",
      "debug",
      [
        [
          10000,
          1669384801,
          "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
          "",

          1669384800,
          "50000000000000000",
          1669406400,
          0,
          5300,

          1669384800,
          "50000000000000000",
          1669406400,
          0,
          2000,

          1669406400,
          "50000000000000000",
          1669492800,
          0,

          1669492800,
          "80000000000000000",
          1669579200,
          0
        ]
      ]
    );
  }

//执行测试
{    let getinfo = await l_call_contract(
  addr1,
  "OOC",
  "OOC_mint",
  [
    [
      gainerAddr,
      "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
      "5",
      "9999999999",
      "0",
      ...Object.values(getsign.data.result)
    ],
    1
  ],
  {
    value:"50000000000000000"
  }
);

}


//aftertest
{   
  console.log("After test query results:");
 let getinfo2 = await l_call_contract(
  owner,
  "OOC",
  "ownerOf",
  [
    tokenid
  ]
);
console.log(getinfo2);
if(getinfo2 == gainerAddr){
  console.log("mint成功，钱包地址一致！")
}
else{console.log("测试失败！")}
let getinfo3 = await l_call_contract(
  owner,
  "OOC",
  "balanceOf",
  [
    gainerAddr
  ]
);
console.log(getinfo3);}
if(getinfo3 = "1"){
  console.log("mint成功，地址下nft个数+1！")
}
else{console.log("测试失败！")}
ownerAddrAmount=await ethers.provider.getBalance(owner.address);
console.log("ownerAddrAmount:"+ownerAddrAmount);
gainerAddrAmount=await ethers.provider.getBalance(addr1.address);
console.log("gainerAddrAmount:"+gainerAddrAmount);



}























// 后面不用管

main()
  .then(() => process.exit(0))
  .catch((error) => {
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