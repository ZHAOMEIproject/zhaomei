# Contract Function
Contract name: owl_base.sol
## 目录
* [WEB业务逻辑](#WEB业务逻辑)
    * [读取函数](#读取函数)
    * [写入函数](#写入函数)
    * [后端接口](#后端接口)

## WEB业务逻辑
### 铸造nft 

查询用户钱包地址。  
查询用户nonces: nonces(用户地址).call  
然后json文件（直接一个文件形式）读取用户下一次铸nft的操作信息。  
json例子,用户地址=>铸造池类型=>nonces=>得到要上链的参数。  
获取的信息的注释：收nft的地址，铸造池类型，时间戳，签名vrs.
```json
{
 "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2": {
  "0": {
   "1": [
    "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    "0",
    "9999999999",
    "27",
    "0xd16010ebf7af3bf733dac71014a207844a711515426aa8eae41fc5419c947ffc",
    "0x37e1a02e098d37e623f9a57f7cef0a2eb91c374aec38652f5309e6426902585f"
   ]
  }
 }
}
```

### 读取函数
balanceOf(address owner).call                       //读取用户nft拥有量

tokenOfOwnerByIndex(address owner,uint index).call  //遍历用户持有的nft

sell_price().call                                   //需要支付的eth数量

### 写入函数
sell_mint().send{value:amount}                      //出售nft

test_sell_Mint(address to).send{value:amount}       //测试版出售nft
