const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');


// {
//   // 加载区块链网络
//   // 通过区块链网络id和合约名称获取区块链网络的url: contractinfo[id][contractname].network.url
//   let provider = new ethers.providers.JsonRpcProvider(contractinfo[id][contractname].network.url);
// }

async function main(){
  // 加载钱包
  let [owner, addr1, addr2] = await ethers.getSigners();
  // 加载合约信息
  let contractinfo = await getcontractinfo();
  console.log(contractinfo);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });