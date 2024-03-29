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
var dir;
const info = {};
async function writer_info_all(network,Artifact,addr,Argument){
  const deploymentPath = path.resolve(__dirname, `../deployments`);
  await creatfile(deploymentPath);
  await set_base_info(network,Artifact,addr);
  info["constructorArguments"]=Argument;
  dir = deploymentPath+`/${network.name}/${Artifact.contractName}.json`;
  await writeFile(dir, JSON.stringify(info, null, 2));
  console.log(`Exported deployments into ${deploymentPath}`);
}
async function writer_info_all_proxy(network,Artifact,addr,Argument,proxyaddr){
  const deploymentPath = path.resolve(__dirname, `../deployments`);
  await creatfile(deploymentPath);
  await set_base_info(network,Artifact,addr);
  info["constructorArguments"]=Argument;
  info["p_address"]=proxyaddr;
  dir = deploymentPath+`/${network.name}/${Artifact.contractName}.json`;
  await writeFile(dir, JSON.stringify(info, null, 2));
  console.log(`Exported deployments into ${deploymentPath}`);
}
async function writer_info(network,Artifact,addr){
  const deploymentPath = path.resolve(__dirname, `../deployments`);
  await creatfile(deploymentPath);
  await set_base_info(network,Artifact,addr);
  dir = deploymentPath+`/${network.name}/${Artifact.contractName}.json`;
  await writeFile(dir, JSON.stringify(info, null, 2));
  console.log(`Exported deployments into ${deploymentPath}`);
}

async function creatfile(deploymentPath){
  if(!fs.existsSync(deploymentPath)){
    await fs.mkdirSync(deploymentPath,{recursive: true});
  }
  dir = deploymentPath+`/${network.name}`;
  if(!fs.existsSync(dir)){
    await fs.mkdirSync(dir,{recursive: true});
  }
}
async function set_base_info(network,Artifact,addr){
  info["contractName"] = Artifact.contractName;
  info["abi"] = Artifact.abi;
  info["address"]=addr;
  info["constructorArguments"]=[];
  info["network"] = {};
  info.network["name"]=network.name;
  info.network["chainId"]=network.config.chainId;
  info.network["url"]=network.config.url;
}

module.exports = {
  writer_info,
  writer_info_all,
  writer_info_all_proxy
}