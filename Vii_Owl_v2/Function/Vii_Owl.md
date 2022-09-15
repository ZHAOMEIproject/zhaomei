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
获取测试用的铸造信息：http://154.91.156.113:10909/v1/owl/owlsigninfo

### 进度条
已经铸造的币mintednumber().call  
1、输出签名的地址
http://154.91.156.113:10909/v1/contractapi/read?id=80001&contractname=VII_OWL&fun=signcheck&params=[["0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","0","9999999999","28","0x8ca02070e2e07c9f2c8de396381d981686d2753cd6534d2dbfce1840121eae77","0x5902e5739a6266d90f1bb37bfbf3bd6a63c1511403ef4f55664920bfff9989f6"],"0"]

2、获取一个签名例子 签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740
http://154.91.156.113:10909/v1/apigetsign/getsign?id=80001&contractname=VII_OWL&params={"gainer":"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","nonce":"0","typemint":"0","deadline":"9999999999"}

3、获取测试用的铸造信息：http://154.91.156.113:10909/v1/owl/owlsigninfo