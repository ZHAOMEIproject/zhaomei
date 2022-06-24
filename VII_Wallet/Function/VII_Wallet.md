# Contract Function
Contract name: VII_FRAME.sol
* [后端接口](#后端接口)


# 后端接口
服务器提交提现请求：
http://154.91.156.113:10903/v1/withdraw/postwirhdraw

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
| servicenonce  | 1 | 提交序号，预防重复提交或者是其他问题  |

获取服务器nonce:


审核人员签名版提现接口：
http://154.91.156.113:10903/v1/withdraw/postwirhdraw

|       |       |       |
|   -------------   |   -------------   |   -------------   |
| 参数  | 例子  | 说明  |
| auditor | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 审核人员地址  |
| spender | 0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2  | 收款地址  |
| amount  | 100 | 收款数量，需要传原值，如果传1个币，精度为18，则要传10**18 |
| auditor_nonce  | 1 | 审核人员审核序号，预防重复提交或者是其他问题  |
| deadline  | 1655956321  | 时间戳  |
| sign_r  | 27 | 签名的r  |
| sign_s  | 0xafd40fe9b48a100939d8bf1e574bc0d329851e18a6b3d72618e55eacb5bcebb8  | 签名的s |
| sign_v  | 0x6a0f776ba03b9462828e6824eb7dc9df1426ea376b5f2d3ee2473bcb53718e33  | 签名的v |

