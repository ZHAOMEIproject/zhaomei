# Contract Function
Contract name: owl_base.sol
## 目录
* [测试](#测试)
* [WEB业务逻辑](#WEB业务逻辑)
    * [读取函数](#读取函数)
    * [写入函数](#写入函数)
    * [后端接口](#后端接口)
## 测试
[合约信息](../Hardhat_Contract/deployments/newinfo/VII_OWL.json):newinfo为最新的
当前：https://mumbai.polygonscan.com/address/改地址#writeContract

### 开放参数的设置
view_set().call：查看配置

dbug(开放时间，限定池截止时间，抢铸池截止时间，总供应量，限定池供应量，抢铸池供应量).send  
限定池截止后，铸造的数量会从限定池转到抢铸池。  

FreeMint(json里的数据).send  
1、json例子,用户地址=>铸造池类型=>nonces=>得到要上链的参数。如果为null，则不在白名单。  
2、可以调用别人的签名，但是会nft还是发给该拥有的人。（允许别人调用不是bug）  
3、获取测试用的铸造信息：http://154.91.156.113:10909/v1/owl/owlsigninfo

## WEB业务逻辑
### 铸造nft  
1、查询用户nonces: nonces(用户地址).call
2、两个按钮，限定池和抢铸池，分别对应0和1。  
3、然后json文件（直接一个文件形式）读取用户下一次铸nft的操作信息。  
4、json例子,用户地址=>铸造池类型=>nonces=>得到要上链的参数。如果为null，则不在白名单。  
获取的信息的注释：收nft的地址，铸造池类型，时间戳，签名vrs.
5、FreeMint(json里对应的数组参数).send
```json
{
 "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2": {
  "0": {
   "0": [
    "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    "0",
    "9999999999",
    "27",
    "0x16c48b993ba40cd2a227403bcacea3438213a09a8905f049a55b6ab27045106c",
    "0x797e0b63a0aa454a4f3ec5f66001e253cc8b3f8a4375dbd90304f8ea1cc28e43"
   ]
  }
 },
 "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178": {
  "0": {
   "0": [
    "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
    "0",
    "9999999999",
    "28",
    "0x340a9b37c6526e6c3282ddf7ea2d501e3bc8d4f60ef87b123368dd03fadc7c20",
    "0x4e710c0e998864ede1b4b2ff558e09a840f3992d87b312fb324b41b93936160f"
   ],
   "1": [
    "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
    "0",
    "9999999999",
    "27",
    "0x3c91b699b7b4c5a93d05977d29b409a692028881adf59556c8aa3e03131aa44b",
    "0x7739a7b8e120e8a72a89ec0e26cac379fa1533814e28518df0d8d5a5c2b0a658"
   ]
  }
 },
 "0x1F8B99d0D35Df008b3341D865f72887e9d45c141": {
  "1": {
   "0": [
    "0x1F8B99d0D35Df008b3341D865f72887e9d45c141",
    "1",
    "9999999999",
    "27",
    "0xcd9f74e0e433fe694419870c23caea9fe4eb35faccff4877b892db4be96d087c",
    "0x68fd7a7ecb766a9ff620d3b6aaeea1eb99d555dded14e5127adeda14a66915ae"
   ],
   "1": [
    "0x1F8B99d0D35Df008b3341D865f72887e9d45c141",
    "1",
    "9999999999",
    "28",
    "0x959584a596cbdb770a5fc614c759210f07fa3ab7d06145c8354a3b7d212a52c8",
    "0x33de7d4104baa27bf8605f52475485dd384a99bf9847530e85a3273267065086"
   ]
  }
 },
 "0x1E14589a0486aE6060A2eF966bE5702c998a6902": {
  "0": {
   "0": [
    "0x1E14589a0486aE6060A2eF966bE5702c998a6902",
    "0",
    "9999999999",
    "28",
    "0x8b5ef132f77b3e81eac0fa18d04d2e82fc9f6547003bb2a300ecb22ac32f8661",
    "0x52e31a1adf394b852f834263cc4d842f94aaeb4e01e3e35b389279141a2d3ec5"
   ],
   "1": [
    "0x1E14589a0486aE6060A2eF966bE5702c998a6902",
    "0",
    "9999999999",
    "27",
    "0x236dc9a81839cd0b7f4fc2e9e22162bcbacbc935c8ad154f2615c393e397ded8",
    "0x4b66e6c6be9841fb0ceddeab058d559bf44643dae501df6c0edb14f2eedb9765"
   ]
  }
 },
 "0x4B05DBd3a8cE4238161C6a9eaFEB1B61Eba37165": {
  "1": {
   "0": [
    "0x4B05DBd3a8cE4238161C6a9eaFEB1B61Eba37165",
    "1",
    "9999999999",
    "27",
    "0xc7d4fa16be4dcae3da73940b70631aee2ffc7a4bd063094d9d090c476f7a67aa",
    "0x0614f69f7475b26d69e38d89ff3a422b55af7cc9122c76c9e2a77f6cc1b0e999"
   ],
   "1": [
    "0x4B05DBd3a8cE4238161C6a9eaFEB1B61Eba37165",
    "1",
    "9999999999",
    "27",
    "0x3499019ee6353014162ef55c7159d27fee20f32ba450ebb48bcb873750ccbfaa",
    "0x3b3cfc40cca841180ffd66b63ff8d5cee99f9d857d73bd3249329a0324ee243a"
   ]
  }
 }
}
```
### 进度条
已经铸造的币mintednumber().call  
1、输出签名的地址
http://154.91.156.113:10909/v1/contractapi/read?id=80001&contractname=VII_OWL&fun=signcheck&params=[["0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","0","9999999999","28","0x8ca02070e2e07c9f2c8de396381d981686d2753cd6534d2dbfce1840121eae77","0x5902e5739a6266d90f1bb37bfbf3bd6a63c1511403ef4f55664920bfff9989f6"],"0"]

2、获取一个签名例子 签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740
http://154.91.156.113:10909/v1/apigetsign/getsign?id=80001&contractname=VII_OWL&params={"gainer":"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","nonce":"0","typemint":"0","deadline":"9999999999"}

3、获取测试用的铸造信息：http://154.91.156.113:10909/v1/owl/owlsigninfo