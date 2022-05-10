const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");

describe("owl_base", function () {
  it("Owl_p owner should be the sender", async function () {
    const [owner,addr1] = await ethers.getSigners();
    // const Owl = await hre.ethers.getContractFactory("owl_base");
    // const owl = await hre.upgrades.deployProxy(Owl);
    // await owl.deployed();
    // expect(await owl.owner()).to.equal(owner.address);
    var owner_value = owner.value;
    console.log(owner_value);
    // const mintTx = await owl.connect(addr1).sell_Mint({value:web3.utils.toWei});
    // wait until the transaction is mined
    // await mintTx.wait();
    // expect(await owl.balanceOf(addr1.address)).to.equal("1");

    


    // expect(await greeter.greet()).to.equal("Hello, world!");
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
