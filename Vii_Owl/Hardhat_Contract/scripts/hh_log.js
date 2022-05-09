const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
/**
 * 记录合约发布地址
 * @param {*} deployments json
 * @param {*} name 类型
 * @param {*} network 网络
 */
// for Hardhat deployment
async function writer_info(network,Artifact,addr){
  const deploymentPath = path.resolve(__dirname, `../deployments`);
  if(!fs.existsSync(deploymentPath)){
    await fs.mkdirSync(deploymentPath,{recursive: true});
  }
  var dir = deploymentPath+`/${network.name}`;
  if(!fs.existsSync(dir)){
    await fs.mkdirSync(dir,{recursive: true});
  }
  dir = deploymentPath+`/abi`;
  if(!fs.existsSync(dir)){
    await fs.mkdirSync(dir,{recursive: true});
  }

  

  const info = {};
  info["contractName"] = Artifact.contractName;
  info["abi"] = Artifact.abi;
  dir = deploymentPath+`/abi/${Artifact.contractName}.json`;
  await writeFile(dir, JSON.stringify(info, null, 2));

  info["address"]=addr
  info["network"] = {};
  info.network["name"]=network.name;
  info.network["chainId"]=network.config.chainId;
  info.network["url"]=network.config.url;
  dir = deploymentPath+`/${network.name}/${Artifact.contractName}.json`;
  await writeFile(dir, JSON.stringify(info, null, 2));

  console.log(`Exported deployments into ${deploymentPath}`);
}
module.exports = {
  writer_info
}