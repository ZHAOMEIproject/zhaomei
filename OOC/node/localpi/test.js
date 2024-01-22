const ethers = require("ethers");
// let provider = new ethers.providers.JsonRpcProvider(secret.url);
// let provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com");
let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

main();
async function main() {
    let accounts = [
        "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
        "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
        "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
        "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
        "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356"
    ]
    for (let i in accounts) {
        Gather(accounts[i])
    }
}
async function Gather(privateKey) {
    try {
        let wallet = new ethers.Wallet(privateKey, provider);
        let nonce = await wallet.getTransactionCount();
        let gasprice = 4000000000;
        let gaslimt = 21000;
        let balance = BigInt(await wallet.getBalance());
        let gasuse = BigInt(gasprice * gaslimt);
        let tx = {
            to: "0x78101c089Fe0BCb5C32BcfE2Ed81FbFc0002DA3c",
            value: "0x" + (balance - gasuse).toString(16),
            nonce: nonce,
            gasPrice: gasprice,
            gasLimit: gaslimt,
        }
        // console.log(tx);
        console.log(wallet.address);
        wallet.sendTransaction(tx)
    } catch (error) {
        console.log(error);
    }
}