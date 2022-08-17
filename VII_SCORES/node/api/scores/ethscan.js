const request = require("request");
const totalinfo = require("../../../info/info.json");
const scores_max={
    "opensea_buy_max":150,
    "opensea_gas_use_max":200,
    "opensea_eth_use_max":600,
    "success_nonce_max":150,
    "total_nft_max":150,
    "main_nft_max":50,
    "blue_max":300,
    "superblue_max":500
}
const scores_max_out={
    "opensea_buy_max":150*1.5,
    "opensea_gas_use_max":200*1.5,
    "opensea_eth_use_max":600*1.5,
    "success_nonce_max":150*1.5,
    "total_nft_max":150*1.5,
    "main_nft_max":50*1.5,
    "blue_max":300*1.5,
    "superblue_max":500*1.5
}

//根据得到的数据，处理得到自己想要的
function ScanApi(url){
    return new Promise(function (resolve, reject) {
        request({
            timeout:10000,    // Set timeout
            method:'GET',     // Set method
            url:url
        },async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let json = JSON.parse(body);
                resolve(json.result);
            }else{
                console.log("message --> get api event contract fail.");
                global.zwjerror =true;
                resolve();
            }
        })
    })
}

async function otherinfo(address){
    let userscaninfo = await ScanApi("https://api.etherscan.io/api?module=account&action=txlist&sort=asc"
    +"&apikey=NSYDK2DA22ZKUCJXKQ6NHR1FY4ZPJM8YP8&address="
    +address
    );
    if(global.zwjerror){
        return
    }

    let [opensea_buy,opensea_gas_use,opensea_eth_use,success_nonce,fistopenseatime]=[0,0,0,0,0];
    if(userscaninfo.length!=0){
        fistopenseatime=userscaninfo[0].timeStamp;
    }
    
    for(let i in userscaninfo){
        if(userscaninfo[i].isError != '0' ){
            continue;
        }
        if(totalinfo.opensea.includes(userscaninfo[i].to)){
            opensea_buy++;
            opensea_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
            opensea_eth_use+=(userscaninfo[i].value*1);
        }
        // total_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
        if(userscaninfo[i].blockNumber>12715107){
            success_nonce+=1;
        }
    }






    return {
        opensea_buy:opensea_buy,
        opensea_buy_s:l_max_add(opensea_buy*5,scores_max.opensea_buy_max),
        opensea_gas_use:opensea_gas_use,
        opensea_gas_use_s:l_max_add(opensea_gas_use/(10**16)*3*5,scores_max.opensea_gas_use_max),
        opensea_eth_use:opensea_eth_use,
        opensea_eth_use_s:l_max_add(opensea_eth_use/(10**18)*5,scores_max.opensea_eth_use_max),
        fistopenseatime:fistopenseatime,
        success_nonce:success_nonce,
        success_nonce_s:l_max_add(success_nonce*5,scores_max.success_nonce_max)
    }
}

async function nftinfo(address){
    address=address.toLowerCase();
    let nftinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=tokennfttx&sort=asc"
    +"&apikey=7FYH9WPWUNJYUEK7992KHGFHI6W1B8EMAK&address="
    +address
    );

    if(global.zwjerror){
        return;
    }

    let [main_nft,blue,superblue,total_nft,fist721time]=[0,0,0,0,0];
    if(nftinfo.length!=0){
        fist721time=nftinfo[0].timeStamp;
    }
    for(let i in nftinfo){
        let flag =1;
        if(nftinfo[i].from==address){
            flag=-1;
        }
        if(totalinfo.blue.includes(nftinfo[i].contractAddress)){
            blue+=flag;
        }
        if(totalinfo.superblue.includes(nftinfo[i].contractAddress)){
            superblue+=flag;
        }
        if(totalinfo.topnft.includes(nftinfo[i].contractAddress)){
            main_nft+=flag;
        }
        total_nft+=flag;
    }

    return {
        fist721time:fist721time,
        main_nft:main_nft,
        main_nft_s:l_max_add(main_nft*20,scores_max.main_nft_max),
        blue:blue,
        blue_s:l_max(blue*50,scores_max.blue_max),
        superblue:superblue,
        superblue_s:l_max(superblue*125,scores_max.superblue_max),
        total_nft:total_nft,
        total_nft_s:l_max(total_nft*5,scores_max.total_nft_max),
        topaccount:(address in totalinfo.topaccount)
    }
}

// async function usdtbalance(address){
//     let usdtinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=tokenbalance&tag=latest"
//     +"&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7"
//     +"&apikey=7B8S6DPCHKEE5FGWX9JPR7Z9KNB44Q9CIS&address="
//     +address
//     );
//     return [usdtinfo,l_max(usdtinfo/10**10*15,15)];
// }

// async function ethbalance(address){
//     let ethinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=balance&tag=latest"
//     +"&apikey=C522UM5F3DTIKW8VWUV35VPIIPR55WY79Z&address="
//     +address
//     );
//     return [ethinfo,l_max(ethinfo/10**18*55/50,55)];
// }

function l_max(score,max){
    return Exponential(score,max);;
}
function l_max_add(score,max){
    if(score>0){
        score+=100;
    }
    return l_max(score,max);
}

function Exponential(score,max){
    score=score*1950/max;
    if(score>2522.576){
        score = 200*(Math.log(score,2))
    }else{
        score = 45*Math.sqrt(score)
    }
    return score*max/1950;
}
async function otherinfov2(address){
    // console.log("test3");
    const sdk = require('api')('@reservoirprotocol/v1.0#2fkbk3fl6e9wi9x');
    await sdk.auth('f9e65d81-69b3-46d2-87b3-491bc1680ec4');
    let userscaninfo = await sdk.getUsersActivityV2({
        users: address,
        limit: '20',
        accept: '*/*'
    })
    let activitiesinfo = [];
    let [opensea_buy,opensea_gas_use,opensea_eth_use,success_nonce,fistopenseatime]=[0,0,0,0,0];
    let fist721time=0;

    do {
        activitiesinfo= [...activitiesinfo,...userscaninfo.activities]
        // console.log(userscaninfo.continuation);
        if(userscaninfo.continuation==null){
            break;
        }
        userscaninfo = await  sdk.getUsersActivityV2({
            users: address,
            limit: '20',
            continuation: userscaninfo.continuation,
            accept: '*/*'
        })
    } while (true);
    if(activitiesinfo.length!=0){
        fist721time=activitiesinfo[activitiesinfo.length-1].timestamp;
    }

    

    for (let i in activitiesinfo) {
        if (activitiesinfo[i].type=="ask") {
            opensea_buy++;
            opensea_eth_use+=activitiesinfo[i].price*10**18
            fistopenseatime=activitiesinfo[i].timestamp;
        }
    }



    return {
        opensea_buy:opensea_buy,
        opensea_buy_s:l_max_add(opensea_buy*5,scores_max.opensea_buy_max),
        opensea_gas_use:opensea_gas_use,
        opensea_gas_use_s:l_max_add(opensea_gas_use/(10**16)*3*5,scores_max.opensea_gas_use_max),
        opensea_eth_use:opensea_eth_use,
        opensea_eth_use_s:l_max_add(opensea_eth_use/(10**18)*5,scores_max.opensea_eth_use_max),
        fistopenseatime:fistopenseatime,
        success_nonce:success_nonce,
        success_nonce_s:l_max_add(success_nonce*5,scores_max.success_nonce_max),
        fist721time:fist721time,
    }
}

let nftbalanceofabi=[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}]
const web3 = require('web3');
var web3js=new web3("https://api.mycryptoapi.com/eth");


async function nftinfov2(address){
    const sdk = require('api')('@reservoirprotocol/v1.0#587j3fl6mo6cd2');

    await sdk.auth('f9e65d81-69b3-46d2-87b3-491bc1680ec4');
    await sdk.server('https://api.reservoir.tools');
    let nftinfo = await sdk.getUsersUserTokensV3({
        sortBy: 'acquiredAt',
        sortDirection: 'desc',
        offset: '0',
        limit: '20',
        includeTopBid: 'false',
        user: address,
        accept: '*/*'
    })
    let activitiesinfo =[];
    let [main_nft,blue,superblue,total_nft]=[0,0,0,0];

    do {
        activitiesinfo= [...activitiesinfo,...nftinfo.tokens]
        // console.log(userscaninfo.continuation);
        nftinfo = await sdk.getUsersUserTokensV3({
            sortBy: 'acquiredAt',
            sortDirection: 'desc',
            offset: activitiesinfo.length,
            limit: '20',
            includeTopBid: 'false',
            user: address,
            accept: '*/*'
        })
        if(nftinfo.tokens.length==0){
            break;
        }
    } while (true);
    for(let i in activitiesinfo){
        total_nft++;
        let nft_contract = activitiesinfo[i].token.contract
        if(totalinfo.blue.includes(nft_contract)){
            blue++;
        }
        if(totalinfo.superblue.includes(nft_contract)){
            superblue++;
        }
        if(totalinfo.topnft.includes(nft_contract)){
            main_nft++;
        }
    }
    let contract = new web3js.eth.Contract(nftbalanceofabi,"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB");
    let userbalanceof = await contract.methods.balanceOf(address).call();
    superblue+=userbalanceof;
    return {
        main_nft:main_nft,
        main_nft_s:l_max_add(main_nft*20,scores_max.main_nft_max),
        blue:blue,
        blue_s:l_max(blue*50,scores_max.blue_max),
        superblue:superblue,
        superblue_s:l_max(superblue*125,scores_max.superblue_max),
        total_nft:total_nft,
        total_nft_s:l_max(total_nft*5,scores_max.total_nft_max),
        topaccount:(address in totalinfo.topaccount)
    }
}
module.exports={
    otherinfo,
    otherinfov2,
    nftinfo,
    nftinfov2,
    scores_max_out,
    // usdtbalance,
    // ethbalance
}