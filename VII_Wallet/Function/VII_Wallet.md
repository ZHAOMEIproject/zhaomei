# Contract Function
Contract name: VII_Wallet.sol
* [BACK业务逻辑](#BACK业务逻辑)
    * [后端接口](#后端接口)
        * [服务器提交提现请求](#服务器提交提现请求)
        * [审核人员签名版提现接口](#审核人员签名版提现接口)
        * [查询订单详情](#查询订单详情)
        * [获取查询签名接口](#查询签名的地址)
* [前端业务逻辑](#前端业务逻辑)
    * [合约接口](#合约接口)

## BACK业务逻辑
1、postwithdraw提交提现请求。
（postwithdrawsign）审核人员签名版。
### 后端接口

### 服务器提交提现请求
http://154.91.156.113:10903/v1/withdraw/postwithdraw?spender=0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2&amount=10000&orderid="0x62f362b0c1202b1a7d8fe85c"

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
<!-- | servicenonce  | 1 | 提交序号，预防重复提交或者是其他问题  | -->
| orderid  | 0x62f362b0c1202b1a7d8fe85c | 提交订单号，预防重复提交或者是其他问题  |

<!-- 2、获取服务器最新nonce:
http://154.91.156.113:10903/v1/withdraw/getwithdrawnonce -->


### 审核人员签名版提现接口
http://154.91.156.113:10903/v1/withdraw/postwithdrawsign?auditor=0xC66f6B7814B886aA104573FCe17862c2ce906740&spender=0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1&amount=1000&auditor_nonce=2&sign_v=28&sign_r=0xd65802cb772a0ae078ba4d0b69056e55b2e775e962f413549c8cf8a2d22b7778&sign_s=0x642b063113ec9f89343e2920e7508e0620b1f38efc0379af8c0770b9d0275008&deadline=9999999999&orderid="0x62f362b0c1202b1a7d8fe85c"

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
| orderid  | 0x62f362b0c1202b1a7d8fe85c | 提交订单号，预防重复提交或者是其他问题  |

### 查询订单详情
http://154.91.156.113:10903/v1/withdraw/checkorderid

post  
```json
{
    "orderids":[
        "0x62f362b0c1202b1a7d8fe85c",
        "0x62f362b0c1202b1a7d8fe85a","0x62f362b0c1202b1a7d8fe85b"
        ]
}
```
返回已确定到账的提现订单
```json
[
    {
        "block_logIndex":8,
        "transaction_hash":"0x66a1f821e8a102b17025c5c57621a52e873ce36c11206004500fb413b28c6686",
        "to":"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
        "amount":"10000",
        "orderid":"0x62f362b0c1202b1a7d8fe85a"
    },
    {
        "block_logIndex":11,
        "transaction_hash":"0x66a1f821e8a102b17025c5c57621a52e873ce36c11206004500fb413b28c6686",
        "to":"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
        "amount":"10000",
        "orderid":"0x62f362b0c1202b1a7d8fe85b"
    }
]
```

### 查询签名的地址
http://154.91.156.113:10903/v1/contractapi/read?id=80001&contractname=mainwithdraw&fun=signcheck&params=[["0xC66f6B7814B886aA104573FCe17862c2ce906740","0xC66f6B7814B886aA104573FCe17862c2ce906740","1000","9999999999","28","0xa46083a905d136486f511b08692b2f8741f3d9ef692b36e7b85725dbdafe5e41","0x2a2466d10cf80acc260482dd228336e0996d8ccbabd69bce359f66bd8ad0584d"],0]  
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
签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740  
http://154.91.156.113:10903/v1/apigetsign/getsign?id=80001&contractname=mainwithdraw&params={"auditor":"0xC66f6B7814B886aA104573FCe17862c2ce906740","spender":"0xC66f6B7814B886aA104573FCe17862c2ce906740","amount":"1000","nonce":"100","deadline":"9999999999"}

## 前端业务逻辑
    1、获取审核人员授权nonce。
    2、将各种数据签名并传给后端。
    签名数据：
    （接口哈希，审核人员钱包地址，接收代币的钱包的地址，审核人员nonces，时间戳(秒级)）
    签名版本_hashTypedDataV4。（tip:_hashTypedDataV4涉及哪条链哪条）

### 合约接口
    1、获取审核人员的nonces: nonces(address).call
    2、获取接口哈希 _PERMIT_TYPEHASH().call
    3、输出签名的地址 signer = signcheck([auditor,spender,amount,deadline,v,r,s],nonce).call
    auditor:签名地址
    spender:收款地址
    amount：收款数量
    deadline：时间戳
    v,r,s:签名信息
### 后端接口
1、输出签名的地址  
http://154.91.156.113:10903/v1/contractapi/read?id=80001&contractname=mainwithdraw&fun=signcheck&params=[["0xC66f6B7814B886aA104573FCe17862c2ce906740","0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","1000","9999999999","27","0x402b9edcf86f9f47f8c3ffc8d02d006cf86cc7cfa6774e062899993a7d803f58","0x3c275a3fdaa4856af226c9dde354971ac53b9608668aa2330c684d0766b6f083"],3]  

2、获取一个签名例子
签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740  
http://154.91.156.113:10903/v1/apigetsign/getsign?id=80001&contractname=mainwithdraw&params={"auditor":"0xC66f6B7814B886aA104573FCe17862c2ce906740","spender":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","amount":"1000","nonce":"3","deadline":"9999999999"}


