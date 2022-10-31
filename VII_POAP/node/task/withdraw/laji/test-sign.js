const {getcontractinfo}=require('../../nodetool/readcontracts');
const ethers = require('ethers');
const secret = global.secret;

test();
async function test(){
    const contractinfo = await getcontractinfo();
    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let provider = new ethers.providers.JsonRpcProvider(contractinfo.mainwithdraw.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);

    let keccak256 = ethers.utils.keccak256;
    let toUtf8Bytes = ethers.utils.toUtf8Bytes;
    let _PERMIT_TYPEHASH = keccak256(toUtf8Bytes("testhash(uint256 testamount)"));
    let info =ethers.utils.hexZeroPad(ethers.utils.hexlify(100),32);
    let abicode = new ethers.utils.AbiCoder;
    let structHash = keccak256(abicode.encode([ "bytes32"], [ _PERMIT_TYPEHASH]));

    let nameHash = keccak256(toUtf8Bytes("name"));
    let versionHash = keccak256(toUtf8Bytes("version"));
    let typeHash = keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"));
    let blockid = ethers.utils.hexZeroPad(ethers.utils.hexlify(1),32);
    let addressthis = "0x5A86858aA3b595FD6663c2296741eF4cd8BC4d01";
    let _domainSeparatorV4 = keccak256(abicode.encode(
        ["bytes32","bytes32","bytes32","uint256","address"],
        [typeHash, nameHash, versionHash, blockid, addressthis]));
    
    let signhash= ethers.utils.solidityPack(
        [ "string", "bytes32", "bytes32" ], 
        [ "\x19\x01", _domainSeparatorV4, structHash]);
    


    console.log(signhash);
    // // All properties on a domain are optional
    // const domain = {
    //     name: 'name',
    //     version: 'version',
    //     chainId: 1,
    //     verifyingContract: '0x5A86858aA3b595FD6663c2296741eF4cd8BC4d01'
    // };

    // // The named list of all type definitions
    // const types = {
    //     amount:[
    //         {name:"_PERMIT_TYPEHASH",type:"bytes32"}
    //     ]
    // };

    // // The data to sign
    // const value = {
    //     _PERMIT_TYPEHASH:_PERMIT_TYPEHASH,
    // };



    // // let signTypedData = await wallet._signTypedData(domain, types, value);
    
    // // console.log(account.address);
    // // console.log(signTypedData);
    // console.log(structHash);
    // let signPromise = wallet._signTypedData(domain, types, value);

    let signPromise = wallet.signMessage(signhash);
    signPromise.then((signature) => {
        // Flat-format
        console.log(signature);
        // "0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474
        //    301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c
        //    1c"
        // Expanded-format
        console.log(ethers.utils.splitSignature(signature));
        // // {
        // //   r: "0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474",
        // //   s: "0x301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c",
        // //   v: 28,
        // //   recoveryParam: 1
        // //  }
        console.log(ethers.utils.verifyMessage(signhash,signature));
    });
    


}