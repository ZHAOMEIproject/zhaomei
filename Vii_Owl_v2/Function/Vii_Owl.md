# Contract Function
Contract name: owl_base.sol
## 目录
* [WEB业务逻辑](#WEB业务逻辑)
    * [读取函数](#读取函数)
    * [写入函数](#写入函数)
    * [后端接口](#后端接口)
    
* [BACK业务逻辑](#BACK业务逻辑)
    * [读取函数](#读取函数)
    * [后端接口](#后端接口)

## WEB业务逻辑
### 销售铸造nft 
读取需要支付的eth数量sell_price()，显示出来的需要除18位单位，铸造nft接口sell_mint(){value:amount}。

### 用户地址和收货地址的绑定
查询用户是否拥有nft balanceOf(address owner),遍历显示用户持有的nft tokenOfOwnerByIndex(address owner,uint index)。  
后端读取nft tokenid是否已经绑定收货地址（待定接口A），没有绑定则可以进行绑定。
签名和签名信息发送给后端（待定接口B）。后端验证成功返回结果。  
签名信息： 接口哈希，钱包地址，tokenid，收货地址，deadline。

### 读取函数
balanceOf(address owner).call                       //读取用户nft拥有量

tokenOfOwnerByIndex(address owner,uint index).call  //遍历用户持有的nft

sell_price().call                                   //需要支付的eth数量

### 写入函数
sell_mint().send{value:amount}                      //出售nft

test_sell_Mint(address to).send{value:amount}       //测试版出售nft

### 后端接口
待定接口A  
待定接口B  

## BACK业务逻辑
### 用户地址和收货地址的绑定
接收签名与签名信息，验证签名地址是否等于用户地址，区块链查询tokenid是否属于 ownerOf(uint256 tokenid)，诺是，则存入数据库，并且数据库以tokenid为唯一键。
签名信息： 接口哈希，钱包地址，tokenid，收货地址，deadline。
### 查询tokenid是否绑定了收货地址
接收tokenid，查询数据库是否有对应数据，有则返回ture。

### 读取函数
ownerOf(uint256 tokenid).call                       //读取拥有tokenid的钱包地址。

### 后端接口
待定接口A  
待定接口B  