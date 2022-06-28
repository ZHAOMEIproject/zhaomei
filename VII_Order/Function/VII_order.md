# Contract Function
Contract name: VII_Order.sol
## 目录
* [总业务逻辑](#总业务逻辑)
* [WEB业务逻辑](#WEB业务逻辑)
    * [读取函数](#读取函数)
    * [写入函数](#写入函数)
    * [后端接口](#后端接口)
* [BACK业务逻辑](#BACK业务逻辑)
    * [读取函数](#读取函数)
    * [后端接口](#后端接口)

## 总业务逻辑
## WEB业务逻辑
除主要合约外的合约地址：
|   网络    | 网络id | USDC |
|   -------------   |   -------------   |   -------------   |
|   BNB | 56        |   0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d    |
|   ETH |   1       |   0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48    |
|   TBNB |   97     |   0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684    |
查询余额：
balanceOf(),call    return(uint256 value)


### 读取函数
本币价格接口
ethprice().call     returns(uint256 price)

### 写入函数
本币支付接口  
eorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s).send  
订单号，金额，时间戳，签名，从后端接口获取。

U支付接口  
uorder(uint256 order,uint256 amount ,uint256 deadline ,uint8 v,bytes32 r,bytes32 s).send  
订单号，金额，时间戳，签名，从后端接口获取。



## BACK业务逻辑

### 读取函数
order_state(uint256 order).call     returns(uint256 value)
order是订单号，回传付款金额，大于0则为已付款。


### 后端接口
http版合约接口:  
http://154.91.156.113:10904/v1/contractapi/read?  
fun=order_state&params=123456  
fun为接口名  
params为参数数组，无则不填或留空，按顺序填。  
account则是用来查询的钱包地址。  

获取签名接口：  
http://154.91.156.113:10904/v1/getsign/getsign?  
order=123&amount=123&deadline=99999999

order订单号  
amount金额  
deadline时间戳
返回签名vsr。