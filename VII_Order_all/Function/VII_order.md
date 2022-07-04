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
|   BNB       | 56        |   0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d    |
|   ETH       |   1       |   0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48    |
|   TBNB      |   97      |   0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684    |
|   Ropsten   |   3       |   0x07865c6E87B9F70255377e024ace6630C1Eaa37F    |

pancakeswap : 
https://pancakeswap.finance/swap

testpancakeswap : 
https://pancake.kiemtienonline360.com/#/swap

uniswap : 
https://app.uniswap.org/#/swap

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

| 网络id | 合约名称 |
| ------------- | ------------- |
|       3        |       TE_order        |
|       97        |      TB_order         |
|       1        |       E_order        |
|       57        |      B_order         |

| 事件  | 参数  |
| ------------- | ------------- |
| order | 

http版合约接口:  
http://154.91.156.113:10906/v1/contractapi/read?  
id=3&contractname=TB_order&fun=order_state&params=123456  



| 参数 | 注释 |
| ------------- | ------------- |
|       id        |       区块链网络号        |
|       contractname        |       合约名字        |
|       fun        |       接口名        |
|       params        |       参数数组        |


获取签名接口：  
http://154.91.156.113:10906/v1/apigetsign/getsign?  
id=3&contractname=TE_order&order=123&amount=123&deadline=99999999

| 参数 | 注释 |
| ------------- | ------------- |
|       id        |       区块链网络号        |
|       contractname        |       合约名字        |
|       order        |       订单号        |
|       amount        |       金额        |
|       deadline        |       时间戳        |
|               |               |
|       返回签名        |       vsr        |




签名的其他信息  
秘钥：530a977e4e14dbc5063ff0c5f78deac73337c935adaf09052de32de68659cc28  
签名名称：“VII_order”  
接口哈希  
PERMIT_TYPEHASH = keccak256(  
  toUtf8Bytes("order(uint256 order,uint256 amount,uint256 deadline)")  
)  

