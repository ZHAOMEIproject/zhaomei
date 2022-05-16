# Contract Function
Contract name: VII_FRAME.sol
## 目录
* [WEB业务逻辑](#WEB业务逻辑)
    * [读取函数](#读取函数)
    * [写入函数](#写入函数)
    * [后端接口](#后端接口)
    
* [BACK业务逻辑](#BACK业务逻辑)
    * [读取函数](#读取函数)
    * [后端接口](#后端接口)

## WEB业务逻辑
### 总业务逻辑
1、用户进入界面，绑定钱包地址，查询后端接口A，钱包是否绑定了虚拟相框。
2、查询用户是否拥有nft,balanceOf(address owner).call。
3、如果没有：则需要safeMint(address to).send 铸造一个，等待结果返回，跳到1循环。
4、如果有：则遍历用户背包tokenOfOwnerByIndex(address owner,uint index).call。
5、读取tokenURI(uint256 id).call，获取URI链接，访问URI链接获取json文件，json文件带有图片链接和等级属性等。
6、用户选取要使用的虚拟相框nft，签名并传给后端接口B，等待接口返回结果。

### 读取函数
balanceOf(address owner).call                       //读取用户nft拥有量

tokenOfOwnerByIndex(address owner,uint index).call  //遍历用户持有的nft

tokenURI(uint256 id).call                           //读取nft的json的url。

### 写入函数
safeMint(address to).send                           //铸造nft

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

### tokenURI标准格式
```json
// 如果一张图片的tokenid为666，信息存放链接为https://portal.neondistrict.io/asset/。
// 则对外链接为https://portal.neondistrict.io/asset/666
// 通过这个链接获取下面json信息
{
  // 项目名称
  "name": "OpenSea Creatures",
  // 项目简介
  "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
  // nft图片存放
  "image": "https://openseacreatures.io/image.png",
  // 此tokenid对外链接
  "external_link": "https://openseacreatures.io",
  // token在opensea买卖时，出售价格的1%将会发到fee_recipient。
  "seller_fee_basis_points": 100, # Indicates a 1% seller fee.
  "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721" # Where seller fees will be paid to.
}
```