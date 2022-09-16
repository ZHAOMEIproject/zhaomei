
const {getcontractinfo}=require('../nodetool/id-readcontracts');
const ethers = require('ethers');
const secret = global.secret;

async function contractcall(params){
    
    let id = params.id;
    let contractname = params.contractname;

    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(contractinfo[id][contractname].network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo[id][contractname].address, 
        contractinfo[id][contractname].abi, 
        provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    var data;
    try {
        if(params.params.length>0){
            tx = await contractWithSigner[params.fun](...params.params);
        }else{
            tx = await contractWithSigner[params.fun]();
        }
    } catch (error) {
        console.log(error);
        data={
            success:false,
            data:{
                account:account.address,
                result:tx
            },
        };
        return data;
    }
    
    data={
        success:true,
        data:{
            account:account.address,
            result:tx
        },
    }
    return data;
}

const readcontracts=require('../nodetool/readcontracts');
async function newcontractcall(params){
    let contractname = params.contractname;

    const contractinfo = await readcontracts.getcontractinfo();
    var path = "m/44'/60'/0'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(contractinfo[contractname].network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        contractinfo[contractname].address, 
        contractinfo[contractname].abi, 
        provider
    );
    let contractWithSigner = contract.connect(wallet);
    let tx;
    var data;
    try {
        if(params.params.length>0){
            tx = await contractWithSigner[params.fun](...params.params);
        }else{
            tx = await contractWithSigner[params.fun]();
        }
    } catch (error) {
        console.log(error);
        data={
            success:false,
            data:{
                account:account.address,
                result:tx
            },
        };
        return data;
    }
    
    data={
        success:true,
        data:{
            account:account.address,
            result:tx
        },
    }
    // console.log(params);
    return data;
}
module.exports ={
    contractcall,
    newcontractcall
}