const request = require("request");
function wait(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

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
                if(json.result=='Max rate limit reached'){
                    await wait(1000);
                    resolve(ScanApi());
                }
                resolve(json.result);
            }else{
                console.log("message --> get api event contract fail,retry");
            }
        })
    })
}

async function otherinfo(address){
    let userscaninfo = await ScanApi("https://api.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc"
    +"&apikey=NSYDK2DA22ZKUCJXKQ6NHR1FY4ZPJM8YP8&address="
    +address
    );
    let [opensea_buy,opensea_buy_s,
        opensea_gas_use,opensea_gas_use_s,
        opensea_eth_use,opensea_eth_use_s,
        total_gas_use,total_gas_use_s,
        success_nonce,success_nonce_s
    ]=[0,0,0,0,0,0,0,0,0,0];
    for(let i=userscaninfo.length-1;i>=0;i--){
        if(userscaninfo[i].isError != '0' ){
            continue;
        }
        if(userscaninfo[i].to=="0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b"||userscaninfo[i].to=="0x7f268357A8c2552623316e2562D90e642bB538E5"){
            opensea_buy++;
            opensea_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
            opensea_eth_use+=(userscaninfo[i].value);
        }
        total_gas_use+=(userscaninfo[i].gasUsed*userscaninfo[i].gasPrice);
        success_nonce+=1;
    }
    opensea_buy_s =l_max(opensea_buy/3*2,10,10)
    opensea_gas_use_s = l_max(opensea_gas_use/(10**17),10);
    opensea_eth_use_s = l_max(opensea_eth_use/(10**18),10);
    total_gas_use_s = l_max(total_gas_use/(5*10**17),10);
    success_nonce_s = l_max(success_nonce/10,10);
    return [opensea_buy,opensea_buy_s,
        opensea_gas_use,opensea_gas_use_s,
        opensea_eth_use,opensea_eth_use_s,
        total_gas_use,total_gas_use_s,
        success_nonce,success_nonce_s]
}

async function nftinfo(address){
    let nftinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=tokennfttx&page=1&offset=100&startblock=0&endblock=99999999&sort=asc"
    +"&apikey=7FYH9WPWUNJYUEK7992KHGFHI6W1B8EMAK&address="
    +address
    );
    let [main_nft]=[0];
    for(let i=nftinfo.length-1;i>=0;i--){
        if(nftinfo[i].contractAddress=="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
        ||nftinfo[i].contractAddress=="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"
        ||nftinfo[i].contractAddress=="0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e"){
            main_nft++;
        }
    }
    return [main_nft,l_max(main_nft*4,20),nftinfo.length,l_max(nftinfo.length*2/3,20)];
}

async function usdtbalance(address){
    let usdtinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=tokenbalance&tag=latest"
    +"&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7"
    +"&apikey=7B8S6DPCHKEE5FGWX9JPR7Z9KNB44Q9CIS&address="
    +address
    );
    return [usdtinfo,l_max(usdtinfo/10**10*15,15)];
}

async function ethbalance(address){
    let ethinfo = await ScanApi("https://api.etherscan.io/api?module=account&action=balance&tag=latest"
    +"&apikey=C522UM5F3DTIKW8VWUV35VPIIPR55WY79Z&address="
    +address
    );
    return [ethinfo,l_max(ethinfo/10**18*55/50,55)];
}

function l_max(score,max){
    if(score>max){
        return max;
    }
    return score;
}
module.exports={
    otherinfo,
    nftinfo,
    usdtbalance,
    ethbalance
}