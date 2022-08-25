const { ecsign } = require('ethereumjs-util');
const ethers = require("ethers");
const {getPermitDigest} = require('./signatures')
const secret = global.secret;

test()
async function test(){

    let name="VII_WITHDRAW";
    let address="0x2Fe7b4556667a944B14F6dcfef1FEbD5fe4bc90d";
    let chainId=80001;

    var path = "m/44'/60'/0'/0/0";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);
    let add = account._signingKey().privateKey;
    const ownerPrivateKey = Buffer.from(add.slice(2), 'hex')
    // 获取加密信息
    const digest = getPermitDigest(
        name, address, chainId,
        "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2", 
        "0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2", 
        ethers.utils.parseEther('100').toString(10),
        0, 
        9999999999
    )
    // ["0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2","100000000000000000000","9999999999","27","0xafd40fe9b48a100939d8bf1e574bc0d329851e18a6b3d72618e55eacb5bcebb8","0x6a0f776ba03b9462828e6824eb7dc9df1426ea376b5f2d3ee2473bcb53718e33"]
    console.log(ethers.utils.parseEther('100').toString(10));
    // get vrs
    let { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), ownerPrivateKey)
    let sign= "0x" + r.toString('hex')+s.toString('hex')+v;

    console.log(v,"0x"+r.toString('hex'),"0x"+s.toString('hex'));

    r = '0x' + sign.substring(2).substring(0, 64);
    s = '0x' + sign.substring(2).substring(64, 128);
    v = '0x' + sign.substring(2).substring(128, 130);

    console.log(sign);
    // console.log(v,"0x"+r.toString('hex'),"0x"+s.toString('hex'));
    console.log(r,s,v);
}