const ethers = require("ethers");
let provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
const jsonFile = require('jsonfile')
let balances =new Object();
let nftbalances =new Object();
let secret_key = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
// const secret = require("../../../../bnbapi/.bnbsecret.json");
const secret={
    baseinfo:{
        chainId:1,
        contractname:"OOC"
    }
}
const { getcontractinfo } = require('../nodetool/id-readcontracts');

main()
async function main() {
    // updatebalance()
    // out0()
    // a_balance()

    // nftbalance();
    // nft_balance()
    // Statistics()

    // get_account();
    // getdd_balance();
    nonftaccount();
}

// 0.55eth
async function updatebalance(){
    let tasks=new Array();
    let accounts = await jsonFile.readFileSync("./info/account.json");
    for (let i in accounts) {
        tasks.push(getbalance(i));
    }
    await Promise.all(tasks);
    await jsonFile.writeFileSync("./info/balance.json", balances, { spaces: 2, EOL: '\r\n' });
}
async function getbalance(address){
    balances[address]= await provider.getBalance(address);
}
async function out0(){
    let accounts = await jsonFile.readFileSync("./info/balance.json");
    for(let i in accounts){
        if (parseInt(accounts[i].hex,16)<50000000000000000) {
            delete accounts[i]
        }
    }
    await jsonFile.writeFileSync("./info/balance2.json", accounts, { spaces: 2, EOL: '\r\n' });
}
async function a_balance(){
    let total=0;
    let accounts = await jsonFile.readFileSync("./info/balance2.json");
    for (let i in accounts) {
        total+=parseInt(accounts[i].hex,16);
    }
    console.log(total);
}
async function nftbalance(){
    let tasks=new Array();
    let accounts = await jsonFile.readFileSync("./info/account.json");
    for (let i in accounts) {
        tasks.push(getnftbalance(i));
    }
    await Promise.all(tasks);
    await jsonFile.writeFileSync("./info/nftbalance.json", nftbalances, { spaces: 2, EOL: '\r\n' });
}
async function getnftbalance(address){
    let baseinfo = secret.baseinfo;
    let contractinfo = await getcontractinfo();
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let wallet = new ethers.Wallet(secret_key, provider);
    let contractWithSigner = contract.connect(wallet);
    tx = await contractWithSigner.balanceOf(address);
    nftbalances[address]= tx;
}
async function nft_balance(){
    let nftbalan = await jsonFile.readFileSync("./info/nftbalance.json");
    let total=0;
    for (let i in nftbalan) {
        total+=parseInt(nftbalan[i].hex,16);
    }
    console.log(total);
}
async function Statistics(){
    let allnft = await jsonFile.readFileSync("./info/nftbalance.json");
    let og50_nft=0;
    let og50ac = await jsonFile.readFileSync("./info/OG_account.json");
    for (let i in og50ac) {
        og50_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("OG50 NFT amount:",og50_nft);

    let og2_nft=0;
    let og2ac = await jsonFile.readFileSync("./info/WL_account.json");
    for (let i in og2ac) {
        og2_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("og2 NFT amount:",og2_nft);

    let dd_nft=0;
    let ddac = await jsonFile.readFileSync("./info/dd_account.json");
    for (let i in ddac) {
        dd_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("dd NFT amount:",dd_nft);
}

async function get50account(){
    let allnft = await jsonFile.readFileSync("./info/nftbalance.json");
    let og50_nft=0;
    let og50ac = await jsonFile.readFileSync("./info/OG_account.json");
    for (let i in og50ac) {
        og50_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("OG50 NFT amount:",og50_nft);

    let og2_nft=0;
    let og2ac = await jsonFile.readFileSync("./info/WL_account.json");
    for (let i in og2ac) {
        og2_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("og2 NFT amount:",og2_nft);

    let dd_nft=0;
    let ddac = await jsonFile.readFileSync("./info/dd_account.json");
    for (let i in ddac) {
        dd_nft+=parseInt(allnft[i].hex,16);
    }
    console.log("dd NFT amount:",dd_nft);

}

async function getdd_balance(){
    // let accounts = await jsonFile.readFileSync("./info/dd_account.json");
    let accounts = await jsonFile.readFileSync("./info/WL_account.json");
    // let accounts = await jsonFile.readFileSync("./info/OG_account.json");
    let balance = await jsonFile.readFileSync("./info/balance.json");
    let amount=0;
    let eth=0;
    let ac = new Array();
    for (let i in accounts) {
        if (parseInt(balance[i].hex,16)>=100000000000000000) {
            amount++;
            eth+=parseInt(balance[i].hex,16)
            ac.push(i)
            // console.log(i);
        }
    }
    await jsonFile.writeFileSync("./end.json",ac);
    console.log(amount,eth);
}
async function get_account(){
    let balance = await jsonFile.readFileSync("./info/nftbalance.json");
    let amount=0;
    for (let i in balance) {
        if (parseInt(balance[i].hex,16)!=0) {
            amount++;
        }
    }
    console.log(amount);
}

async function nonftaccount(){
    let outaccounts=[]
    let outaccountslist=[]
    let allnft = await jsonFile.readFileSync("./info/nftbalance.json");
    let balance = await jsonFile.readFileSync("./info/balance.json");
    let totalamount=0;
    for (let i in allnft) {
        const element = parseInt(allnft[i].hex,16);
        // console.log(element,parseInt(balance[i].hex,16));
        // console.log(element==0,parseInt(balance[i].hex,16)!=0,element==0&&parseInt(balance[i].hex,16)!=0);
        if (element==0&&parseInt(balance[i].hex,16)!=0) {
            outaccounts.push({
                account:i,
                amount:parseInt(balance[i].hex,16)
            })
            outaccountslist.push[i];
            totalamount+=parseInt(balance[i].hex,16)
        }
    }
    console.log(totalamount);
    await jsonFile.writeFileSync("./info/nonftaccount.json", outaccounts, { spaces: 2, EOL: '\r\n' });
    // await jsonFile.writeFileSync("./info/nonftaccountlist.json", outaccountslist, { spaces: 2, EOL: '\r\n' });
}
// 19734979917395902000
async function guiji(){
    let guijiaccount = await jsonFile.readFileSync("./info/nonftaccount.json");
    let secretkey_list
    // =await jsonFile.readFileSync("./info/secretkey_list.json");
    return
    for (let i in guijiaccount) {
        const secret_key = secretkey_list[guijiaccount[i].account];
        let wallet = new ethers.Wallet(secret_key, provider);
        let gasPrice=30;
        let tx = {
            to: "0xf9EE94c6Bb7Bd2e1B8B76Ea11cF4eDcD57a6aEa2",
            value: guijiaccount[i].account-(gasPrice*21000),
            gasPrice:gasPrice
        }
        await wallet.sendTransaction(tx)
    }
}
async function outsecret(){
    let guijiaccount = await jsonFile.readFileSync("./info/nonftaccount.json");
    let secretkey_list=[]
    let secretkeys
    // = await jsonFile.readFileSync("./info/secretkey_list.json");
    for (let i in guijiaccount) {
        secretkey_list.push(secretkeys[guijiaccount[i].account])
    }
    await jsonFile.writeFileSync("./info/secretkey_list.json", secretkey_list, { spaces: 2, EOL: '\r\n' });



}