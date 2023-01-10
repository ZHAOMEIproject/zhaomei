import { ethers } from 'ethers';

main()

async function main() {
    let mnemonic = "13662867868";
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

    // Load the second account from a mnemonic
    let path = "m/44'/60'/0'/0/0";
    let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    console.log(secondMnemonicWallet);
    // // Load using a non-english locale wordlist (the path "null" will use the default)
    // let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, null, ethers.wordlists.ko);
}