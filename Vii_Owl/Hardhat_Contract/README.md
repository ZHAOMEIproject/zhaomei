# Contract
## 目录
* [Deployment_and_testing](#Deployment_and_testing) 
* [Contract_info](#Contract_info)

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

```shell
# npm install hardhat
# npx hardhat test
npx hardhat run scripts/1_deploy_VII_OWL.js --network polygonMumbai
//部署合约
npx hardhat verify
```

## Contract_info
|       |       |
|   -------------   |   -------------   |
|   owl_base.sol    |   nft逻辑合约      |
