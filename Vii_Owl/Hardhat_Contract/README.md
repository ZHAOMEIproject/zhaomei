# Contract
## 目录
* [Deployment_and_testing](#Deployment_and_testing) 
    * [local](#local) 
    * [other_netowrk](#other_netowrk) 
* [Contract_Addresses](#Contract_Addresses)

## Deployment_and_testing
hardhat.config.js文件中的secretinfo需要手动添加。
secret参考文件格式
```json
{
    "mnemonic":"秘钥",
    "apiKey":{
        "bscTestnet": "apiKey",
        "ropsten":"apiKey",
        "polygonMumbai":"apiKey"
    }
}
```
### other_netowrk
```shell
# npm install hardhat
# npx hardhat test --network polygonMumbai
npx hardhat compile
npx hardhat clean
# npx hardhat node
npx hardhat run scripts/1_deploy_owl_base.js --network polygonMumbai
//部署逻辑合约
npx hardhat run scripts/2_deploy_owl_p.js --network polygonMumbai
//部署代理合约并初始化
npx hardhat run scripts/p_verify.js --network polygonMumbai
//遍历验证所有合约代码
npx hardhat run scripts/3_updata_owl_p.js --network polygonMumbai
//更新逻辑合约
```

