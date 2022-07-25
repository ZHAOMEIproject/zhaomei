var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('ws://localhost:8546');
const TronWeb = require('tronweb')
const fs = require('fs')


// creatw();
exports.creatw = 
async function creatw(cpu,random,args){
    // var args = require('minimist')(process.argv.slice(2));
    args.parame = args.parame.toString();

    var time = new Date().getTime();
    var lasti =0;

    let trxcheckl=34-args.parame.length;
    for (let i = 0;true; i++) {
        let nowtime = new Date().getTime();
        let account = accounts.create(toString(random+i));
        // console.log(account);
        Tron = TronWeb.address.fromHex("41"+account.address.slice(2))
        // console.log(Tron);
        // if(i%50==0){
        if(Tron.slice(trxcheckl)==args.parame){
            // console.log(args.parame,args.parame.length,trxcheckl,Tron.slice(trxcheckl),Tron.slice(trxcheckl)==args.parame);
            // console.log(nowtime);
            console.log("第",i,"次");
            // console.log(account.address);
            console.log(Tron);
            fs.writeFileSync('input.txt', Tron+'\r\n'+account.privateKey+'\r\n',{flag:"a"},  function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        }
        if((nowtime - time)>5000){
            console.log("线程",cpu,"5s跑了：",i-lasti,"个地址");
            lasti=i;
            time=nowtime;
        }
    }
}

// module.exports ={
//     creatw
// }