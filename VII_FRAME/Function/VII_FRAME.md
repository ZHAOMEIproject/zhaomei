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
1、用户publicMint(address to).send 铸造nft
2、

### 写入函数
publicMint(address to).send                           //铸造nft

## BACK业务逻辑
### 绑定tokenid
sql存储tokenid,owner,minter信息

### 读取中心化数据库


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