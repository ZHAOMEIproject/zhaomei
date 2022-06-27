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
npx hardhat run scripts/1_proxy_nft.js --network polygonMumbai
//部署合约
npx hardhat run scripts/p_verify.js --network polygonMumbai
//验证逻辑合约代码
npx hardhat run scripts/2_updata_nft.js --network polygonMumbai
//更新逻辑合约
```

## Contract_info
|       |       |
|   -------------   |   -------------   |
|   VII_FRAME.sol    |   VII_FRAME逻辑合约 [./contracts/VII_FRAME.sol]      |
