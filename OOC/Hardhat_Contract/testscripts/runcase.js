const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
const request = require("request");
const {getsign}=require("../../node/api/sign/getsign");

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/runcase.js --network zhaomei
// (tip: --network 选择链，参考文档.secret.json)

var contractinfo = new Object();
// 

async function main(){

  contractinfo = await getcontractinfo();
    
  // 加载别的钱包
    var path = "m/44'/60'/0'/0/0";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account.address:"+account.address);
    var path = "m/44'/60'/0'/0/1";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account1 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account1.address:"+account1.address);
    var path = "m/44'/60'/0'/0/2";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account2 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account2.address:"+account2.address);
    var path = "m/44'/60'/0'/0/3";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account3 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account3.address:"+account3.address);
    var path = "m/44'/60'/0'/0/4";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account4 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account4.address:"+account4.address);
    var path = "m/44'/60'/0'/0/5";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account5 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account5.address:"+account5.address);
    var path = "m/44'/60'/0'/0/6";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account6 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account6.address:"+account6.address);
    var path = "m/44'/60'/0'/0/7";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account7 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account7.address:"+account7.address);
    var path = "m/44'/60'/0'/0/8";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account8 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account8.address:"+account8.address);
    var path = "m/44'/60'/0'/0/9";// 第0号钱包
    var secret = require("../../../../privateinfo/.secret.json");// 载入很多信息
    const account9 = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    console.log("account9.address:"+account9.address);


    // 给钱包转账
//  let [owner, addr1, addr2] = await ethers.getSigners();
//   await owner.sendTransaction({
//   to: "0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1",
//   value: ethers.utils.parseEther("1") // 1 ether
//  })
// 加蓝筹NFT项目
// {
//   let getinfo = await call_contract(account._signingKey(),"7156777","OOC","addsupportedBcns",
//  [ [["0xc8992606630e767fC7bdB0D7Eb7E4B2aA0a50363",3],["0xA15eB9cc57A4B0c5175dBCCa1775791826c68573",4]]])
// console.log("增加蓝筹完成");
// }


// 调用debug
// {
//   await call_contract(account._signingKey(),"7156777","OOC",
//     "debug",
//     [
//       [
//         "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
//         10000,
//         1671595202,
//         "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
//         "",
//         1671638400,
//         1671811200,
//     // 0号池-自留+：1300+3500=4800
//       1671595200,
//         "50000000000000000",              
//         500,
//         500,
//     // 1号池-OG: 2X<2000
//     1671595200,
//         "50000000000000000",
//         0,
//         1,
//     // 2号池-WL:2y=52-2x-2M
//     1671606000,
//         "50000000000000000",              
//         0,
//     // 3号池-public Z=52-2x-2M-2Y
//     1671638400,
//         "60000000000000000",              
//         0,
//     // 4号-蓝筹WL 2M< 10000-4800-2X(0池和1池)=52-2X
//     1671606000,
//         "50000000000000000",              
//         0
//         ]
//     ]
//   );
//   console.log("debug提交完成")
// }




// 获取ooc的signinfo，授权签名
{    


  const pond=1;
  const addr=account1.address;
  const amount=1;
  signaddr=account1._signingKey();

  let signinfo = await getsign(
        "7156777","OOC",
        [
              addr,
              2,
              "9999999999",
              pond
        ]
        );
      let oocsigninfo=
      [
        addr,
         2,
        "9999999999",
        pond,
        ...Object.values(signinfo)
      ]
    console.log(oocsigninfo)

// oocmint调用
{
  let getinfo = await call_contract(signaddr,"7156777","OOC","OOC_mint",
  [
   0,
    [
      
      addr,      
      2,
      "9999999999",
      pond,
      ...Object.values(signinfo)   
    ],
    amount
  ],
  {
     value:(50000000000000000*amount).toString()
  })
  console.log("oocmint完成");
}
}


// bluemint调用
// {
//   let getinfo = await call_contract(account._signingKey(),"7156777","OOC","Blue_mint",
//   [
//     0,
//     "0xA15eB9cc57A4B0c5175dBCCa1775791826c68573", 
//     0,          
//     2
//   ],
//   {
//      value:(50000000000000000*2).toString()
//   })
//   console.log("bluemint完成");
// }



// public mint
// {
//         const  mintamount=1;      
//       await call_contract(account9._signingKey(),"7156777","OOC",
//       "Public_mint",
//       [  1,    
//         mintamount
//       ],
//       {
//          value:(60000000000000000*mintamount).toString()
//       }          
//     );
//     console.log("public_mint 提交完成");
// }

// stake
// {
//   await call_contract(account._signingKey(),"7156777","OOC","stake",[500,30])
//   console.log("stake提交完成");
  // await call_contract(account._signingKey(),"7156777","OOC","transferFrom ",
  // ["0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178","0x36eA6Ce439a2F74317E912de6BC01103eD24c89d",500])
  // console.log("transferFrom提交完成");

// }


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
