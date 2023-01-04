import { ethers } from 'ethers';

main()

async function main() {
    let privateKey = "0x3141592653589793238462643383279502884197169399375105820974944592"
    let wallet = new ethers.Wallet(privateKey);
    let a="23333";
    let b="hahahaha"
    let c="23333hahahaha"
    // 签名文本消息
    let signPromise = wallet.signMessage(c)

    signPromise.then((signature) => {

        // Flat-format
        console.log(signature);
        // "0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474
        //    301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c
        //    1c"

        // Expanded-format
        console.log(ethers.utils.splitSignature(signature));
        // {
        //   r: "0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474",
        //   s: "0x301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c",
        //   v: 28,
        //   recoveryParam: 1
        //  }
    });
}