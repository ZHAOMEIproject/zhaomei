const ethers = require("ethers");
let bip39 = require('bip39')
const TronWeb = require('tronweb')
var args = require('minimist')(process.argv.slice(2));
args.parame = args.parame.toString();

var time = new Date().getTime();
var lasti =0;
creatw();

async function creatw(){
    var basepath = "m/44'/60'/0'/0/";
    let mnemonic = bip39.generateMnemonic()
    // console.log(mnemonic)
    let trxcheckl=34-args.parame.length;
    for (let i = 0;true; i++) {
        let nowtime = new Date().getTime();
        let path = basepath+i;
        let account = ethers.Wallet.fromMnemonic(mnemonic, path);
        console.log(account.address);
        Tron = TronWeb.address.fromHex("41"+account.address.slice(2))
        // console.log(Tron);
        // if(i%50==0){
        if(Tron.slice(trxcheckl)==args.parame){
            // console.log(args.parame,args.parame.length,trxcheckl,Tron.slice(trxcheckl),Tron.slice(trxcheckl)==args.parame);
            console.log(nowtime);
            console.log(i);
            console.log(account.address);
            console.log(Tron);
        }
        if((nowtime - time)>5000){
            console.log("5s跑了：",i-lasti);
            lasti=i;
            time=nowtime;
        }
    }
}