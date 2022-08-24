# Contract Function
Contract name: VII_Wallet.sol
* [BACK业务逻辑](#BACK业务逻辑)
    * [后端接口](#后端接口)
        * [服务器提交提现请求](#服务器提交提现请求)
        * [审核人员签名版提现接口](#审核人员签名版提现接口)
        * [查询订单详情](#查询订单详情)
        * [获取查询签名接口](#查询签名的地址)
        * [查询充值订单](#查询充值订单)
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
| orderid  | 0x62f362b0c1202b1a7d8fe85c | 提交订单号，预防重复提交或者是其他问题  |

### 审核人员签名版提现接口
http://154.91.156.113:10903/v1/withdraw/postwithdrawsign?auditor=0xC66f6B7814B886aA104573FCe17862c2ce906740&spender=0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1&amount=1000&sign_v=28&sign_r=0x5d5d9a66698dbedd38bf1d21a898394085d849ce2c3c5fd4077d201a3c7c0093&sign_s=0x51d44c61e0d45167f32a3195e7f7189f4d1ae382d594bfeac0b16ab2f9e2ef37&deadline=9999999999&orderid=0x62f362b0c1202b1a7d8fe85c

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
http://154.91.156.113:10903/v1/contractapi/read?id=80001&contractname=mainwithdraw&fun=signcheck&params=[["0xC66f6B7814B886aA104573FCe17862c2ce906740","0xC66f6B7814B886aA104573FCe17862c2ce906740","1000","9999999999","28","0xa46083a905d136486f511b08692b2f8741f3d9ef692b36e7b85725dbdafe5e41","0x2a2466d10cf80acc260482dd228336e0996d8ccbabd69bce359f66bd8ad0584d"]]  
params输入的内容：[auditor,spender,amount,deadline,v,r,s,orderid]

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
| orderid  | 0x62f362b0c1202b1a7d8fe85c | 提交订单号，预防重复提交或者是其他问题  |

5、获取一个签名例子
签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740  
http://154.91.156.113:10903/v1/apigetsign/getsign?id=80001&contractname=mainwithdraw&params={"auditor":"0xC66f6B7814B886aA104573FCe17862c2ce906740","spender":"0xC66f6B7814B886aA104573FCe17862c2ce906740","amount":"1000","order":"100","deadline":"9999999999"}

### 查询充值订单
http://154.91.156.113:10903/v1/withdraw/checkrecharge?blocknumber=0

查询block_number之后的订单。



## 前端业务逻辑
    2、将各种数据签名并传给后端。
    签名数据：
    （接口哈希，审核人员钱包地址，接收代币的钱包的地址，orderid，时间戳(秒级)）
    签名版本_hashTypedDataV4。（tip:_hashTypedDataV4涉及哪条链哪条）

### 合约接口
    2、获取接口哈希 _PERMIT_TYPEHASH().call
    3、输出签名的地址 signer = signcheck([auditor,spender,amount,deadline,v,r,s,orderid]).call
    auditor:签名地址
    spender:收款地址
    amount：收款数量
    deadline：时间戳
    v,r,s:签名信息
### 后端接口
1、输出签名的地址  
http://154.91.156.113:10903/v1/contractapi/read?id=80001&contractname=mainwithdraw&fun=signcheck&params=[["0xC66f6B7814B886aA104573FCe17862c2ce906740","0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","1000","9999999999","28","0x5d5d9a66698dbedd38bf1d21a898394085d849ce2c3c5fd4077d201a3c7c0093","0x51d44c61e0d45167f32a3195e7f7189f4d1ae382d594bfeac0b16ab2f9e2ef37","0x62f362b0c1202b1a7d8fe444"]]  

2、获取一个签名例子
签名地址是：0xC66f6B7814B886aA104573FCe17862c2ce906740  
http://154.91.156.113:10903/v1/apigetsign/getsign?id=80001&contractname=mainwithdraw&params={"auditor":"0xC66f6B7814B886aA104573FCe17862c2ce906740","spender":"0xd7B74f2133C011110a7A38038fFF30bDc9ACe6d1","amount":"1000","orderid":"0x6304a1cf17cfb379e204586d","deadline":"9999999999"}


#### 充值
1、erc20代币：0x9cb423b85f7A83362cA1fFB4f7Cadd89BBD432Fb  
获取余额balanceOf(address).call  
授权approve(address,uint256).send

2、充值合约：0x688C94ec12CDC187d3D623B60917812aedB8C56b  
recharge(address to,uint256 amount).send