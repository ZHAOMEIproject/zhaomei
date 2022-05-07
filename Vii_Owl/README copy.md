# Vii_Owl
[Hardhat_Contract](./Hardhat_Contract)


## 目录
* [Describe](#Describe)
* [Deployment_and_testing](#Deployment_and_testing) 
    * [local](#local) 
    * [other_netowrk](#other_netowrk) 
* [Document](#Document)
    * [前端WebFunction](#WebFunction) 
    * [后端BackFunction](#BackFunction) 
* [Contract_Addresses](#Contract_Addresses)

## Describe
nft-owl: Subproject of viide, An NFT project using agency contracts.  
使用了openzeppelin的开源合约，并添加了部分独有功能。  
例如：发售接口，统一的盲盒开关。

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
## Document
### WebFunction
web3接口
sell_mint().send  
需要0.01eth，会发送到收款地址  
nft发送到sender

test_sell_Mint(address to).send  
需要0.01eth，nft和eth会发送到to地址

balanceOf(address owner).call  
用户拥有的nft数量  

tokenOfOwnerByIndex(address owner,uint index).call  
遍历用户持有的nft,index为顺序  

tokenURL(uint tokenid).call  
nft的json地址接口, json里面有image属性，image对应的图片链接，还有其他属性  

发送签名和其他信息到后端  
签名信息：钱包地址，tokenid，收货地址，签名的哈希。  

和后端配合获取tokenid是否已经被记录。

### BackFunction  
接收签名信息  
验证签名是否是holder  
web抓取nft tokenid是否是owner，接口：ownerOf(tokenId)  
数据库以tokenid为唯一键，如果数据库里有，需要像前端返回该id以记录。

## Contract_Addresses
合约信息(network id，chain name，合约名称，abi，合约地址)：[合约目录](./deployments/)
选择网络后查看具体合约信息
## Contract_Addresses
| Contract  | Test_address | Main_address |
| ------------- | ------------- | ------------- |
| nft-owl-logic |       |       |
| nft-owl-proxy |       |       |

## Contract Function
nft-owl-logic:  
nft-owl-proxy:  

## Contract Operation
