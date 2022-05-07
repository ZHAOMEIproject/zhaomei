# Contract
## 目录
* [Deployment_and_testing](#Deployment_and_testing) 
    * [local](#local) 
    * [other_netowrk](#other_netowrk) 
* [Contract_Addresses](#Contract_Addresses)

## Deployment_and_testing
hardhat.config.js文件中的secretinfo需要修改。
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
### local
```shell
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/sample-script.js
npx hardhat verify 
```
### other_netowrk
```shell
npx hardhat compile
npx hardhat clean
npx hardhat run scripts/sample-script.js --network polygonMumbai
npx hardhat verify address constructor --network polygonMumbai
# npx hardhat test --network polygonMumbai
```