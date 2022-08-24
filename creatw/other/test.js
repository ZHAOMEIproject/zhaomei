var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('ws://localhost:8546');
let bip39 = require('bip39')

creatw();

async function creatw(){
    let mnemonic = bip39.generateMnemonic()
    console.log(mnemonic);
}