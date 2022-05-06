# owl-nft
## 目录
* [Deployment_and_testing](#Deployment_and_testing) 
    * [local](#local) 
    * [other_netowrk](#other_netowrk) 
* []
* [](#)

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
npx hardhat test --network polygonMumbai
```


合约信息(network id，chain name，合约名称，abi，合约地址)：[合约目录](./deployments/)
选择网络后查看具体合约信息
## Contract Addresses ==> Test
| Contract  | Test_address | Main_address |
| ------------- | ------------- | ------------- |
| nft-owl-logic |       |       |
| nft-owl-proxy |       |       |


## Contract Describe
*  owl

## Contract Function
nft-owl-logic:  
nft-owl-proxy:  

## Contract Operation
