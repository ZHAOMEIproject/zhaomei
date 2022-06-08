const request = require("request");
function wait(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};
const totalinfo = require("../../../info/info.json");

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
                // if(json.result=='Max rate limit reached'){
                //     await wait(1000);
                //     resolve(ScanApi());
                // }
                resolve(json.result);
            }else{
                console.log("message --> get api event contract fail.");
                resolve({"zwjerror":true});
            }
        })
    })
}

async function otherinfo(address){
    let userscaninfo = await ScanApi("https://api.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc"
    +"&apikey=NSYDK2DA22ZKUCJXKQ6NHR1FY4ZPJM8YP8&address="
    +address
    );

    if(userscaninfo.zwjerror ==false){
        return {"zwjerror":true};
    }

    let [opensea_buy,opensea_gas_use,opensea_eth_use,success_nonce,fistopenseatime]=[0,0,0,0,0];
    if(userscaninfo.length!=0){
        fistopenseatime=userscaninfo[0].timeStamp;
    }
    
    for(let i in userscaninfo){
        if(userscaninfo[i].isError != '0' ){
            continue;
        }
        if(userscaninfo[i].to in totalinfo.opensea){
            opensea_buy++;
            opensea_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
            opensea_eth_use+=(userscaninfo[i].value);
        }
        // total_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
        if(userscaninfo[i].blockNumber>12715107){
            success_nonce+=1;
        }
    }

    return {
        opensea_buy:opensea_buy,
        opensea_buy_s:l_max(opensea_buy*5,50),
        opensea_gas_use:opensea_gas_use,
        opensea_gas_use_s:l_max(opensea_gas_use/(10**16)*3*5,100),
        opensea_eth_use:opensea_eth_use,
        opensea_eth_use_s:l_max(opensea_eth_use/(10**18)*5,500),
        fistopenseatime:fistopenseatime,
        success_nonce:success_nonce,
        success_nonce_s:l_max(success_nonce*5,50)
    }
}

async function nftinfo(address){
    let nftinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=tokennfttx&page=1&offset=1000&startblock=0&endblock=99999999&sort=asc"
    +"&apikey=7FYH9WPWUNJYUEK7992KHGFHI6W1B8EMAK&address="
    +address
    );

    if(nftinfo.zwjerror ==false){
        return {"zwjerror":true};
    }

    let [main_nft,blue,superblue,total_nft,fist721time]=[0,0,0,0,0];
    if(nftinfo.length!=0){
        fist721time=nftinfo[0].timeStamp;
    }
    for(let i in nftinfo){
        let flag =1;
        if(nftinfo[i].from==address)
        flag=-1;
        if(nftinfo[i].contractAddres in totalinfo.blue){
            blue+=flag;
        }
        if(nftinfo[i].contractAddres in totalinfo.superblue){
            superblue+=flag;
        }
        if(nftinfo[i].contractAddres in totalinfo.topnft){
            main_nft+=flag;
        }
        total_nft+=flag;
    }
    return {
        main_nft:main_nft,
        main_nft_s:l_max(main_nft*20,200),
        blue:blue,
        blue_s:l_max(blue*50,300),
        superblue:superblue,
        superblue_s:l_max(superblue*125,500),
        fist721time:fist721time,
        total_nft:total_nft,
        total_nft_s:l_max(total_nft*5,50),
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
    if(score>max){
        return max;
    }
    return score;
}
module.exports={
    otherinfo,
    nftinfo,
    // usdtbalance,
    // ethbalance
}