var Accounts = require('web3-eth-accounts');

var time = new Date().getTime();
var lasti =0;
var accounts = new Accounts('ws://localhost:8546');

creatw();

async function creatw(){
    for (let i = 0;true; i++) {
        let nowtime = new Date().getTime();
        accounts.create();
        if((nowtime - time)>5000){
            console.log("5s跑了：",i-lasti,"个地址");
            lasti=i;
            time=nowtime;
        }
    }
}