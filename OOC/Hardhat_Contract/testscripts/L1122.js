const hre = require("hardhat");
const {getcontractinfo}=require('./tool/id-readcontracts');
const request = require("request");
const {getsign}=require("../../node/api/sign/getsign");

// 测试的help文档
// require('./help.js')

// 运行测试服务
// npx hardhat run testscripts/L1122.js --network hardhat
// (tip: --network 选择链，参考文档privateinfo/.secret.json)

var contractinfo = new Object();


async function main(){
    // 加载hardhat.config.js设置的钱包
    let [owner, addr1, addr2,addr3,addr4,addr5] = await ethers.getSigners();
    contractinfo = await getcontractinfo();

    // const gainerAddr="0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178";
    const gainerAddr=owner.address;
    const pond=3;
    const minttotal=10;
    const mintamount=2;
    const pond2=3;
    const mintamount2=2;
    
    // 创建OOC_copy用来做蓝筹白名单
    {
//     await l_creat_contract(owner,"OOC_copy",[]);
//     console.log("蓝筹NFT合约地址是："+contractinfo[network.config.chainId]["OOC_copy"].address);
//     blueNFTaddr=contractinfo[network.config.chainId]["OOC_copy"].address;

//     // beforetests
//     {
//         try {     
//           let getinfo2 = await l_call_contract(
//             owner,
//             "OOC_copy",
//             "ownerOf",
//             [
//               0
//             ]
//           );        
//           console.log("查询tokenid=0的nft持有者为："+getinfo2);      }catch(err){
//             console.log("查询tokenid=0的nft持有者为空");
//           }     
//         let getinfo3 = await l_call_contract(
//           owner,
//           "OOC_copy",
//           "balanceOf",
//           [
//             addr1.address
//           ]
//         );
//         console.log("gainerAddr"+addr1.address+"的nft个数 有：   "+getinfo3);
  
//         ownerAddrAmount=await ethers.provider.getBalance(owner.address);
//         console.log("ownerAddr: "+owner.address+"      ownerAddrAmount: "+ownerAddrAmount);
//         minterAddrAmount=await ethers.provider.getBalance(addr1.address);
//         console.log("addr1: "+addr1.address+"      addr1Amount: "+minterAddrAmount);
//         gainerAddrAmount=await ethers.provider.getBalance(gainerAddr);
//         console.log("gainerAddr: "+gainerAddr+"       gainerAddrAmount: "+gainerAddrAmount);
//         blueminterAddrAmount=await ethers.provider.getBalance(addr5.address);
//         console.log("addr5: "+addr5.address+"      blueminterAddrAmount: "+blueminterAddrAmount);
//         console.log("蓝筹Before 执行完成，接下来mint:");
//   }

//     // 钱包签名获取权限
//     let signinfo1 = await getsign(
//       "31337","OOC_copy",
//       [
//         addr1.address,
//         "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
//         minttotal,
//         "9999999999",
//         pond
//       ]
//     );
//       //debug
//       {
//         await l_call_contract(
//           owner,
//           "OOC_copy",
//           "debug",
//           [
//             [
//               addr1.address,
//               100,
//               1671120001,
//               "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
//               "",
//     // 0号池-自留+：200
//               1671098400,
//               "50000000000000000",
//               1671105600,
//               0,
//               53,
//     // 1号池-OG
//               1671098400,
//               "50000000000000000",
//               1671105600,
//               0,
//               20,
//     // 2号池-WL
//               1671112800,
//               "50000000000000000",
//               1671120000,
//               0,
//     // 3号池-public
//               1671120000,
//               "80000000000000000",
//               1671206400,
//               0,
//     // 4号-蓝筹WL
//               1671105600,
//               "50000000000000000",
//               1671112800,
//               0,
//               53
//             ]
//           ]
//         );
//         console.log("蓝筹debug提交完成")
//       }

//          //3号池执行public_mint
//     {   
//         let getinfo = await l_call_contract(
//         addr1,
//         "OOC_copy",
//         "Public_mint",
//           [             
//             2
//           ],
//           {
//              value:(80000000000000000*2).toString()
//           }
//         );
//         let getinfo2 = await l_call_contract(
//             addr2,
//             "OOC_copy",
//             "Public_mint",
//               [             
//                 2
//               ],
//               {
//                  value:(80000000000000000*2).toString()
//               }
//             );
//         await l_call_contract(
//                 addr3,
//                 "OOC_copy",
//                 "Public_mint",
//                   [             
//                     2
//                   ],
//                   {
//                      value:(80000000000000000*2).toString()
//                   }
//                 );
//         console.log("蓝筹ooc_mint提交完成")
//     } 

//     // 查询mint结果
//     {
//     try {     
//       let getinfo2 = await l_call_contract(
//         owner,
//         "OOC_copy",
//         "ownerOf",
//         [
//           0
//         ]
//       );        
//       console.log("查询tokenid=0的nft持有者为："+getinfo2);      }catch(err){
//         console.log("查询tokenid=0的nft持有者为空");
//       }     
//     let getinfo3 = await l_call_contract(
//       owner,
//       "OOC_copy",
//       "balanceOf",
//       [
//         addr1.address
//       ]
//     );
//     console.log("蓝筹gainerAddr"+addr1.address+"的nft个数 有：   "+getinfo3);

//     console.log("蓝筹mint结束");
   
//   }
 }
  

  // 正式创建合约进行测试
    await l_creat_contract(owner,"OOC",[]); 
    //debug
    {
        await l_call_contract(
          owner,
          "OOC",
          "debug",
          [
            [
              "0xE3E628f50B5CDD2418cEb8b58d7BD57A5dABC178",
              20,
              1671098400,
              "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
              "",
              1671206400,
    // 0号池-自留+：1300+3500=4800
              1671098400,
              "50000000000000000",
              1671105600,
              5,
              5,
    // 1号池-OG: 2X<2000
              1671098400,
              "50000000000000000",
              1671105600,
              2,
              3,
    // 2号池-WL:2y=52-2x-2M
              1671112800,
              "50000000000000000",
              1671120000,
              4,
    // 3号池-public Z=52-2x-2M-2Y
              1671120000,
              "60000000000000000",
              1671206400,
              0,
    // 4号-蓝筹WL 2M< 10000-4800-2X(0池和1池)=52-2X
              1671105600,
              "50000000000000000",
              1671112800,
              2,
              2
            ]
          ]
        );
        console.log("debug提交完成")
      }

      // 钱包签名获取权限
      let signinfo = await getsign(
        "31337","OOC",
        [
          gainerAddr,
          // "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
          minttotal,
          "9999999999",
          pond
        ]
      );
   //step1,mint 第一次;
   {
    // beforetests
    {
          try {     
            let getinfo2 = await l_call_contract(
              owner,
              "OOC",
              "ownerOf",
              [
                0
              ]
            );        
            console.log("\n查询tokenid=0的nft持有者为："+getinfo2);      }catch(err){
              console.log("\n查询tokenid=0的nft持有者为空");
            }     
          let getinfo3 = await l_call_contract(
            owner,
            "OOC",
            "balanceOf",
            [
              gainerAddr
            ]
          );
          console.log("gainerAddr"+gainerAddr+"的nft个数 有：   "+getinfo3);
    
          ownerAddrAmount=await ethers.provider.getBalance(owner.address);
          console.log("ownerAddr: "+owner.address+"      ownerAddrAmount: "+ownerAddrAmount);
          minterAddrAmount=await ethers.provider.getBalance(addr1.address);
          console.log("addr1: "+addr1.address+"      addr1Amount: "+minterAddrAmount);
          gainerAddrAmount=await ethers.provider.getBalance(gainerAddr);
          console.log("gainerAddr: "+gainerAddr+"       gainerAddrAmount: "+gainerAddrAmount);
          blueminterAddrAmount=await ethers.provider.getBalance(addr5.address);
          console.log("addr5: "+addr5.address+"      blueminterAddrAmount: "+blueminterAddrAmount);
          console.log("Before 执行完成，接下来mint:");
    }
     //0\1\2池执行OOC_mint
    {   
      let getinfo = await l_call_contract(
        owner,
      "OOC",
      "OOC_mint",
      [
        [
          owner.address,
          // "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
          minttotal,
          "9999999999",
          pond,
          ...Object.values(signinfo)
          // ...Object.values(getsign.data.result)
        ],
        mintamount
      ],
      {
         value:(50000000000000000*mintamount).toString()
      }
    );
    console.log("ooc_mint提交完成")
    } 

         //3号池执行public_mint
        //  {   
        //   await l_call_contract(
        //   addr1,
        //   "OOC",
        //   "Public_mint",
        //   [      
        //     mintamount
        //   ],
        //   {
        //      value:(60000000000000000*mintamount).toString()
        //   }          
        // );
        // console.log("public_mint addr1 提交完成")
        // await l_call_contract(
        //     addr2,
        //     "OOC",
        //     "Public_mint",
        //     [      
        //       mintamount
        //     ],
        //     {
        //        value:(80000000000000000*mintamount).toString()
        //     }          
        //   );
        // console.log("public_mint提交完成")
        // }  
    
       //4号池执行blue_mint
    //    {
    //       // 增加蓝筹白名单
    //     {   
    //       let getinfo = await l_call_contract(
    //       owner,
    //       "OOC",
    //       "addsupportedBcns",
    //       [
    //         [
    //           [
    //             blueNFTaddr, //nft地址
    //             13
    //           ]
    //         ]
    //       ]
    //     );
    //     console.log("4池提交蓝筹项目白名单完成")
    //     } 
    //     // 执行bluemint
    //    {  
    //     for(var i=0;i<1;i++){ 
    //     let getinfo = await l_call_contract(
    //     addr5,
    //     "OOC",
    //     "Blue_mint",
    //     [
    //       blueNFTaddr, 
    //       i,          
    //       mintamount
    //     ],
    //     {
    //        value:(50000000000000000*mintamount).toString()
    //     }
    //   );}     
    //   console.log("blue_mint提交完成")
    //   } 
    // } 

    //aftertest
    {   
      console.log("\nAfter 查询：");
      for(var i=0;i<mintamount;i++){    
        let getinfo2 = await l_call_contract(
            owner,
            "OOC",
            "ownerOf",
           [  i ]   );
    console.log("tokenid= "+i+" 的nft持有者为："+getinfo2);
    // if(getinfo2 == gainerAddr){
    //   console.log("mint获得钱包地址正确！")    }
    // else{console.log("mint获得钱包地址错误，测试失败！")}
  }
    let getinfo3 = await l_call_contract(
      owner,
      "OOC",
      "balanceOf",
      [
        gainerAddr
      ]
    );
    console.log(gainerAddr+"  gainerAddr持有的总nft数为：=mintamount="+getinfo3);

    let getinfo4 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
            addr1.address
        ]
      );
      console.log(addr1.address+" addr1持有的总nft数为：=mintamount="+getinfo4);
      let getinfo5 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
            addr2.address
        ]
      );
      console.log(addr2.address+" addr2持有的总nft数为：=mintamount="+getinfo5);
      let getinfo6 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
            addr3.address
        ]
      );
      console.log(addr3.address+" addr3持有的总nft数为：=mintamount="+getinfo6);
      let getinfo7 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
            addr4.address
        ]
      );
      console.log(addr4.address+" addr4持有的总nft数为：=mintamount="+getinfo7);
      let getinfo8 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
            addr5.address
        ]
      );
      console.log(addr5.address+" addr5持有的总nft数为：=mintamount="+getinfo8);

    // console.log(getinfo3);    
    // if(getinfo3 == mintamount){
    //   console.log(gainerAddr+"  gainerAddr持有的总nft数为：=mintamount="+getinfo3)
    // }
    // else{console.log("token钱包地址非gainer，测试失败！")}

    ownerAddrAmount=await ethers.provider.getBalance(owner.address);
    console.log("ownerAddr: "+owner.address+"      ownerAddrAmount: "+ownerAddrAmount);
    minterAddrAmount=await ethers.provider.getBalance(addr1.address);
    console.log("addr1: "+addr1.address+"      addr1AddrAmount: "+minterAddrAmount);
    gainerAddrAmount=await ethers.provider.getBalance(gainerAddr);
    console.log("gainerAddr: "+gainerAddr+"       gainerAddrAmount: "+gainerAddrAmount);
    blueminterAddrAmount=await ethers.provider.getBalance(addr5.address);
    console.log("addr5: "+addr5.address+"      blueminterAddrAmount: "+blueminterAddrAmount);
  
    }
  }

    // STEP2:ADDR2继续mint,mintamount2次
    console.log("\nSTEP2:再次mint：")
    {
            // 钱包签名获取权限
          let signinfo = await getsign(
            "31337","OOC",
            [
              addr1.address,
              minttotal,
              "9999999999",
              pond2
            ]
          );
    //0/1/2号池子执行ooc_mint
    // {   
    //   let getinfo = await l_call_contract(
    //   addr1,
    //   "OOC",
    //   "OOC_mint",
    //   [
    //     [
    //       addr1.address,
    //     //   "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
    //       minttotal,
    //       "9999999999",
    //       pond2,
    //       ...Object.values(signinfo)
    //       // ...Object.values(getsign.data.result)
    //     ],
    //     mintamount2
    //   ],
    //   {
    //     value:(50000000000000000*mintamount2).toString()
    //   }
    // );
    // console.log("再次ooc_mint完成")
    // }  
         //3号池执行public_mint
            {   
              await l_call_contract(
              addr3,
              "OOC",
              "Public_mint",
              [
                mintamount2
              ],
              {
                 value:(80000000000000000*mintamount2).toString()
              }
            );
            await l_call_contract(
                addr4,
                "OOC",
                "Public_mint",
                [
                  2
                ],
                {
                   value:(80000000000000000*2).toString()
                }
              );
            console.log("public_mint提交完成")
            }      
    //aftertest
    {   
        console.log("\nAfter 查询：");
        for(var i=0;i<mintamount;i++){    
          let getinfo2 = await l_call_contract(
              owner,
              "OOC",
              "ownerOf",
             [  i ]   );
      console.log("tokenid= "+i+" 的nft持有者为："+getinfo2);
      // if(getinfo2 == gainerAddr){
      //   console.log("mint获得钱包地址正确！")    }
      // else{console.log("mint获得钱包地址错误，测试失败！")}
    }
      let getinfo3 = await l_call_contract(
        owner,
        "OOC",
        "balanceOf",
        [
          gainerAddr
        ]
      );
      console.log(gainerAddr+"  gainerAddr持有的总nft数为：=mintamount="+getinfo3);
  
      let getinfo4 = await l_call_contract(
          owner,
          "OOC",
          "balanceOf",
          [
              addr1.address
          ]
        );
        console.log(addr1.address+" addr1持有的总nft数为：=mintamount="+getinfo4);
        let getinfo5 = await l_call_contract(
          owner,
          "OOC",
          "balanceOf",
          [
              addr2.address
          ]
        );
        console.log(addr2.address+" addr2持有的总nft数为：=mintamount="+getinfo5);
        let getinfo6 = await l_call_contract(
          owner,
          "OOC",
          "balanceOf",
          [
              addr3.address
          ]
        );
        console.log(addr3.address+" addr3持有的总nft数为：=mintamount="+getinfo6);
        let getinfo7 = await l_call_contract(
          owner,
          "OOC",
          "balanceOf",
          [
              addr4.address
          ]
        );
        console.log(addr4.address+" addr4持有的总nft数为：=mintamount="+getinfo7);
        let getinfo8 = await l_call_contract(
          owner,
          "OOC",
          "balanceOf",
          [
              addr5.address
          ]
        );
        console.log(addr5.address+" addr5持有的总nft数为：=mintamount="+getinfo8);
  
      // console.log(getinfo3);    
      // if(getinfo3 == mintamount){
      //   console.log(gainerAddr+"  gainerAddr持有的总nft数为：=mintamount="+getinfo3)
      // }
      // else{console.log("token钱包地址非gainer，测试失败！")}
  
      ownerAddrAmount=await ethers.provider.getBalance(owner.address);
      console.log("ownerAddr: "+owner.address+"      ownerAddrAmount: "+ownerAddrAmount);
      minterAddrAmount=await ethers.provider.getBalance(addr1.address);
      console.log("addr1: "+addr1.address+"      addr1AddrAmount: "+minterAddrAmount);
      gainerAddrAmount=await ethers.provider.getBalance(gainerAddr);
      console.log("gainerAddr: "+gainerAddr+"       gainerAddrAmount: "+gainerAddrAmount);
      blueminterAddrAmount=await ethers.provider.getBalance(addr5.address);
      console.log("addr5: "+addr5.address+"      blueminterAddrAmount: "+blueminterAddrAmount);
    
      }
    }

    





}






















// 后面不用管

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

async function call_contract(signingKey,chainId,contractname,fun,params){
  let provider = new ethers.providers.JsonRpcProvider(contractinfo[chainId][contractname].network.url);
  let wallet = new ethers.Wallet(signingKey, provider);
  let contract = new ethers.Contract(
    contractinfo[chainId][contractname].address, 
    contractinfo[chainId][contractname].abi, 
    provider
  );
  let contractWithSigner = contract.connect(wallet);
  let tx;
  if(params.length>0){
    // tx = await contractWithSigner[fun](...params);
    // console.log(...params);
    tx = await contractWithSigner[fun](...params);
  }else{
    tx = await contractWithSigner[fun]();
  }
  return tx
}

async function l_call_contract(wallet,contractname,fun,params,options){
  let contract = new ethers.Contract(
    contractinfo[network.config.chainId][contractname].address, 
    contractinfo[network.config.chainId][contractname].abi, 
    network.config.provider
  );
  let contractWithSigner = contract.connect(wallet);
  let tx;
//   console.log(params.length);
  if(params.length>0){
    // tx = await contractWithSigner[fun](...params);
    // console.log(...params);
    tx = await contractWithSigner[fun](...params,{...options});
  }else{
    tx = await contractWithSigner[fun]({...options});
  }
  return tx
}
const { writer_info_all } = require('./tool/hh_log.js');
async function l_creat_contract(wallet,contractname,arguments){
  const Main_contract = await hre.ethers.getContractFactory(contractname);
  const main_contract = await Main_contract.connect(wallet).deploy(
    ...arguments
  );
  await main_contract.deployed();
  console.log(contractname+" deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact(contractname);
  await writer_info_all(network,Artifact, main_contract,arguments);
  contractinfo = await getcontractinfo();
}
async function creat_contract(signingKey,chain_name,contractname,arguments){
  let provider = new ethers.providers.JsonRpcProvider(secret.hardhatset.networks[chain_name].url);
  let wallet = new ethers.Wallet(signingKey, provider);

  const Main_contract = await hre.ethers.getContractFactory(contractname);
  const main_contract = await Main_contract.connect(wallet).deploy(
    ...arguments
  );
  await main_contract.deployed();
  console.log(contractname+" deployed to:", main_contract.address);
  let Artifact = await artifacts.readArtifact(contractname);
  await writer_info_all(network,Artifact, main_contract,arguments);
  contractinfo = await getcontractinfo();
}

function contractadd(newontract){
  contractinfo[newontract.network.chainId.toString()][newontract.contractName]=newontract;
}

const { network } = require("hardhat");
function getbyurl(url){
  return new Promise(function (resolve, reject) {
      request({
          timeout:10000,    // Set timeout
          method:'GET',     // Set method
          url:url
      },async function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // let body = JSON.parse(body);
              resolve(JSON.parse(body));
          }else{
              resolve();
          }
      })
  })
}

async function wait(ms){
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}
