const ethers = require("ethers");
let provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/k4k7w92FZHQtnAOKcr_q5LW3SxHhrqD2");
const jsonFile = require('jsonfile')
let balances =new Object();
let nftbalances =new Object();
let secret_key = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
const secret = require("../../../../bnbapi/.bnbsecret.json");
const { getcontractinfo } = require('../nodetool/id-readcontracts');
main()
async function main() {
    geteth()
}
async function geteth(){
    
}
