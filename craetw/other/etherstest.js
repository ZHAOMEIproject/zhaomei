const {Wallet} = require("ethers");

var time = new Date().getTime();
var lasti =0;
console.log(Wallet.createRandom());
console.log(Wallet.createRandom());
creatw();

async function creatw(){
    for (let i = 0;true; i++) {
        let nowtime = new Date().getTime();
        Wallet.createRandom();
        if((nowtime - time)>5000){
            console.log("5s跑了：",i-lasti);
            lasti=i;
            time=nowtime;
        }
    }
}