
main()
// async function main() {
//     const { address } = require('js-conflux-sdk');
//     const base32Address = 'cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91';
//     let a = await address.decodeCfxAddress(base32Address)
//     console.log(
//         a
//     );
//     console.log(
//         await address.encodeCfxAddress(a.hexAddress,a.netId)
//     );
//     const mappedAddress = address.cfxMappedEVMSpaceAddress(base32Address);
//     console.log(mappedAddress,base32);
// }
// async function main() {
//     const ethers = require('ethers');
//     const base32Address = 'cfx:aak2rra2njvd77ezwjvx04kkds9fzagfe6ku8scz91';
//     const { address } = require('js-conflux-sdk');
//     const { hexAddress } = address.decodeCfxAddress(base32Address);
//     const keccak = require('keccak');
//     const addbuff=keccak('keccak256').update(hexAddress).digest()
//     console.log(addbuff);
//     console.log(ethers.utils.keccak256(hexAddress).slice(2));
//     console.log(Buffer.from(ethers.utils.keccak256(hexAddress).slice(2),"hex"));
//     const evmaddress=addbuff.slice(-20).toString('hex')
//     console.log(addbuff.slice(0).toString('hex'),evmaddress);

// }
// async function main() {
//     const keccak = require('keccak');
//     const base32 = require('base32');

//     // 以太坊地址
//     const ethAddress = '0x1234567890123456789012345678901234567890';

//     // 去掉前缀 "0x"
//     const ethAddressNoPrefix = ethAddress.slice(2);

//     // 计算 Keccak-256 哈希值
//     const ethAddressHash = keccak('keccak256').update(ethAddressNoPrefix).digest().toString("hex");
//     // console.log(ethAddressHash.toString("hex"));
//     // return
//     // 取后 20 个字节作为公钥
//     const publicKey = ethAddressHash.slice(-20);

//     // 添加 "cfx:" 前缀
//     const cfxAddressPrefix = 'cfx:' + publicKey;

//     // 对公钥进行 base32 编码
//     const cfxAddressSuffix = base32.encode(Buffer.from(publicKey, 'hex')).toString('utf8');

//     // 组合得到新地址
//     const cfxAddress = cfxAddressPrefix + '-' + cfxAddressSuffix;

//     console.log(cfxAddress);

// }
async function main() {
    const { encode, decode } = require('@conflux-dev/conflux-address-js');
    decode('cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957');
    /* {
      hexAddress: '0x1386b4185a223ef49592233b69291bbe5a80c527',
      netId: 1,
      type: 'user'
    } */
    console.log(encode('0x1386b4185a223ef49592233b69291bbe5a80c527', 1029, false));
    return;
    encode('0x1386b4185a223ef49592233b69291bbe5a80c527', 1, true)
    // 'CFXTEST:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6D5R8E957'
    encode('0x1386b4185a223ef49592233b69291bbe5a80c527', 1, false)
    // 'cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957'
    encode('0x1386b4185a223ef49592233b69291bbe5a80c527', 1, true)
    // 'CFXTEST:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6D5R8E957'
    encode('0x1386b4185a223ef49592233b69291bbe5a80c527', 1029, false)
    // 'CFX:TYPE.USER:AAK2RRA2NJVD77EZWJVX04KKDS9FZAGFE6KU8SCZ91'
}