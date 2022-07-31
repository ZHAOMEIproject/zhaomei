# Contract Function
Contract name: VII_FRAME.sol
* [BACK业务逻辑](#BACK业务逻辑)
    * [后端接口](#后端接口)
* [前端业务逻辑](#前端业务逻辑)
    * [合约接口](#合约接口)

## BACK业务逻辑
1、getwirhdrawnonce获取服务器nonce。
2、postwirhdraw提交提现请求。
（postwirhdrawsign）审核人员签名版。
### 后端接口
1、服务器提交提现请求：
http://203.20.113.61:10903/v1/withdraw/postwirhdraw

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
| servicenonce  | 1 | 提交序号，预防重复提交或者是其他问题  |

2、获取服务器最新nonce:
http://203.20.113.61:10903/v1/withdraw/getwirhdrawnonce


3、审核人员签名版提现接口：
http://203.20.113.61:10903/v1/withdraw/postwirhdrawsign

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| auditor | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 审核人员地址  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
| auditor_nonce  | 1 | 审核人员审核序号，预防重复提交或者是其他问题  |
| deadline  | 1655956321  | 时间戳(秒级)  |
| sign_r  | 27 | 签名的r  |
| sign_s  | 0xafd40fe9b48a100939d8bf1e574bc0d329851e18a6b3d72618e55eacb5bcebb8  | 签名的s |
| sign_v  | 0x6a0f776ba03b9462828e6824eb7dc9df1426ea376b5f2d3ee2473bcb53718e33  | 签名的v |

4、输出签名的地址
http://203.20.113.61:10906/v1/contractapi/read?id=97&contractname=mainwithdraw&fun=signcheck&params=[["0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","1000","9999999999","28","0x2ab37818c20f5f5b512848199a0114a044560c879fb377d20c2c3474858a8f3e","0x16b83d22f096ae49396739c9e953335ae2a351d8c7d7e9d11b3446c8a404c4a3"],100]  
params输入的内容：[auditor,spender,amount,deadline,v,r,s],nonce

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| auditor | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 审核人员地址  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
| deadline  | 1655956321  | 时间戳(秒级)  |
| sign_r  | 27 | 签名的r  |
| sign_s  | 0xafd40fe9b48a100939d8bf1e574bc0d329851e18a6b3d72618e55eacb5bcebb8  | 签名的s |
| sign_v  | 0x6a0f776ba03b9462828e6824eb7dc9df1426ea376b5f2d3ee2473bcb53718e33  | 签名的v |
| nonce  | 1 | 审核人员审核序号，预防重复提交或者是其他问题  |

5、获取一个签名例子
http://203.20.113.61:10906/v1/apigetsign/getsign?id=97&contractname=mainwithdraw&params={"auditor":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","spender":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","amount":"1000","nonce":"100","deadline":"9999999999"}

## 前端业务逻辑
    1、获取审核人员授权nonce。
    2、将各种数据签名并传给后端。
    签名数据：
    （接口哈希，审核人员钱包地址，接收代币的钱包的地址，审核人员nonce，时间戳(秒级)）
    签名版本_hashTypedDataV4。（tip:_hashTypedDataV4涉及哪条链哪条）

### 合约接口
    1、获取审核人员的nonce: nonce(address).call
    2、获取接口哈希 _PERMIT_TYPEHASH().call
    3、输出签名的地址 signer = signcheck([auditor,spender,amount,deadline,v,r,s],nonce).call
    auditor:签名地址
    spender:收款地址
    amount：收款数量
    deadline：时间戳
    v,r,s:签名信息
### 后端接口
1、输出签名的地址  
http://203.20.113.61:10906/v1/contractapi/read?id=97&contractname=mainwithdraw&fun=signcheck&params=[["0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","1000","9999999999","28","0x2ab37818c20f5f5b512848199a0114a044560c879fb377d20c2c3474858a8f3e","0x16b83d22f096ae49396739c9e953335ae2a351d8c7d7e9d11b3446c8a404c4a3"],100]  

2、获取一个签名例子
签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740  
http://203.20.113.61:10906/v1/apigetsign/getsign?id=97&contractname=mainwithdraw&params={"auditor":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","spender":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","amount":"1000","nonce":"100","deadline":"9999999999"}


