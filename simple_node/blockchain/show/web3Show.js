const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');
const app = express();

web3js = new web3("https://bsc-dataseed1.binance.org:443");   //  ONLINE
// web3js = new web3("https://data-seed-prebsc-2-s1.binance.org:8545/");    //  TEST

// ABI
let contractABI_token =[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"claimAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_claim_amount","type":"uint256"},{"name":"_decimals","type":"uint8"},{"name":"_initial_account","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}];
let contractABI_ido = [{"constant":false,"inputs":[{"name":"_oneSwapSwitchState","type":"bool"},{"name":"_twoSwapSwitchState","type":"bool"},{"name":"_releaseOneSwitchState","type":"bool"},{"name":"_releaseTwoSwitchState","type":"bool"}],"name":"setSwapSwitchState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_account","type":"address"}],"name":"idoAccountOf","outputs":[{"name":"TotalJoinOneCount","type":"uint256"},{"name":"TotalJoinTwoCount","type":"uint256"},{"name":"TotalPayUsdtAmount","type":"uint256"},{"name":"TotalSwapMacAmount","type":"uint256"},{"name":"JoinOrdersIndex","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payUsdtAmount","type":"uint256"},{"name":"_swapId","type":"uint256"}],"name":"joinSwap","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_usdtTokenContract","type":"address"},{"name":"_macTokenContract","type":"address"},{"name":"_officialAddress","type":"address"}],"name":"setAddressList","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"releaseTwo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getIdoBasic","outputs":[{"name":"DayTime","type":"uint256"},{"name":"UsdtTokenContract","type":"address"},{"name":"MacTokenContract","type":"address"},{"name":"OfficialAddress","type":"address"},{"name":"OneSwapSwitchState","type":"bool"},{"name":"TwoSwapSwitchState","type":"bool"},{"name":"ReleaseOneSwitchState","type":"bool"},{"name":"ReleaseTwoSwitchState","type":"bool"},{"name":"OneNextReleaseTime","type":"uint256"},{"name":"TwoNextReleaseTime","type":"uint256"},{"name":"OneSwapNowJoinAmount","type":"uint256"},{"name":"TwoSwapNowJoinAmount","type":"uint256"},{"name":"SwapNowJoinTotalCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_erc20TokenContract","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"getSedimentToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"releaseOne","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"joinOrdersOf","outputs":[{"name":"Index","type":"uint256"},{"name":"Account","type":"address"},{"name":"JoinTime","type":"uint256"},{"name":"SwapId","type":"uint256"},{"name":"PayUsdtAmount","type":"uint256"},{"name":"SwapMacAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_erc20TokenContract","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"SedimentToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_usdtTokenContract","type":"address"},{"indexed":false,"name":"_macTokenContract","type":"address"},{"indexed":false,"name":"_officialAddress","type":"address"}],"name":"AddressList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_oneSwapSwitchState","type":"bool"},{"indexed":false,"name":"_twoSwapSwitchState","type":"bool"},{"indexed":false,"name":"_releaseOneSwitchState","type":"bool"},{"indexed":false,"name":"_releaseTwoSwitchState","type":"bool"}],"name":"SwitchState","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_swapNowJoinTotalCount","type":"uint256"},{"indexed":false,"name":"_swapId","type":"uint256"},{"indexed":false,"name":"_payUsdtAmount","type":"uint256"},{"indexed":false,"name":"_swapMacAmount","type":"uint256"}],"name":"JoinSwap","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_swapNowJoinTotalCount","type":"uint256"}],"name":"ReleaseOne","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"},{"indexed":false,"name":"_swapNowJoinTotalCount","type":"uint256"}],"name":"ReleaseTwo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]

// Get Token BalanceOf
const getTokenBalanceOf = (contractAddress,myAddress) =>{
    return new Promise(async (resolve, reject)=> {
        let contract = new web3js.eth.Contract(contractABI_token,contractAddress);
        contract.methods.balanceOf(myAddress).call().then(function(result){
            resolve(result);
        });
    })
}

// Get Contract Events
const getContractEvents = (contractAddress,from_timestamp,toBlock) =>{
    return new Promise(async (resolve, reject)=> {
        let contract = new web3js.eth.Contract(contractABI_ido,contractAddress);
        contract.getPastEvents('allEvents', {
            fromBlock: from_timestamp,
            toBlock: toBlock,
        }, function(error, result){
            resolve(result);
        })
    })
}

// getBlockNumber
const getBlockNumber = () =>{
    return new Promise(async (resolve, reject)=> {
        web3js.eth.getBlockNumber().then(function(result){
            resolve(result);
        });
    })
}

module.exports = {
    getTokenBalanceOf,
    getContractEvents,
    getBlockNumber,
};