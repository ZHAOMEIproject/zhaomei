const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/test.js --network hardhat
// (tip: --network 选择链，参考文档.secret.json)

var contractinfo = new Object();

async function main(){
    // 获取项目的合约信息
    contractinfo = await getcontractinfo();
    // console.log("loading");
    // console.log(network);
    // return
    let [owner, addr1, addr2] = await ethers.getSigners();
    console.log(owner.address);
    // return
    // 在--network hardhat部署合约,并自动了更新contractinfo
    await l_creat_contract(owner,"VII_POAP",[]);
    // console.log(contractinfo);
    let getinfo

    {
        // mint前查询
        getinfo =  await l_call_contract(owner,"VII_POAP","balanceOf",
            [owner.address,1]
        );
        if (getinfo!=0) {
            console.log("error：mint前不为0");
        }
    }
    {
        // mint
        await l_call_contract(owner,"VII_POAP","mint_list",
            [[[owner.address,1]]]
        );
        // 查询mint后
        getinfo =  await l_call_contract(owner,"VII_POAP","balanceOf",
            [owner.address,1]
        );
        if (getinfo!=1) {
            console.log("error：mint后不为1");
        }
    }
    {
        // 重复mint，不会报错，在合约里直接跳过，但是可能需要在测试网区块链浏览器才好看出来。
        getinfo =  await l_call_contract(owner,"VII_POAP","mint_list",
            [[[owner.address,1]]]
        );
        getinfo =  await l_call_contract(owner,"VII_POAP","balanceOf",
            [owner.address,1]
        );
        if (getinfo!=1) {
            console.log("error：重复mint后不为1");
        }
    }
    
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

async function l_call_contract(wallet,contractname,fun,params){
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
    tx = await contractWithSigner[fun](...params);
  }else{
    tx = await contractWithSigner[fun]();
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

const request = require("request");
const { network } = require("hardhat");
function getbyurl(url){
  return new Promise(function (resolve, reject) {
      request({
          timeout:10000,    // Set timeout
          method:'GET',     // Set method
          url:url
      },async function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // let json = JSON.parse(body);
              resolve(body);
          }else{
              resolve();
          }
      })
  })
}

async function wait(ms){
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}