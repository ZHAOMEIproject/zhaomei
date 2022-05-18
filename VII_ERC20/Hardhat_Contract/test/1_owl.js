const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("owl_base", function () {

  let Owl;
  let hardhatOwl;
  let owner;
  let addr1;

  beforeEach(async function () {
    Owl = await hre.ethers.getContractFactory("owl_base");
    hardhatOwl = await hre.upgrades.deployProxy(Owl);
    [owner, addr1] = await ethers.getSigners();
    await hardhatOwl.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatOwl.owner()).to.equal(owner.address);
    });
  });
  describe("Mint", function () {
    it("Mint fee, mint tokenid", async function () {
      // Mint fee
      let balance0ETH = await waffle.provider.getBalance(owner.address);
      let mintfee= await hardhatOwl.sell_price();
      let mintTx = await hardhatOwl.connect(addr1).sell_Mint({value:mintfee});
      await mintTx.wait();
      let balance0ETH2 = await waffle.provider.getBalance(owner.address);
      expect(balance0ETH2.sub(balance0ETH)).to.equal(mintfee);
      // balanceof
      expect(await hardhatOwl.balanceOf(addr1.address)).to.equal("1");
      expect(await hardhatOwl.ownerOf("0")).to.equal(addr1.address);
      expect(await hardhatOwl.tokenOfOwnerByIndex(addr1.address,"0")).to.equal("0");
    });
  });

  // it("Owl_p owner should be the sender", async function () {
  //   const [owner, addr1] = await ethers.getSigners();
  //   const Owl = await hre.ethers.getContractFactory("owl_base");
  //   const owl = await hre.upgrades.deployProxy(Owl);
  //   await owl.deployed();
  //   expect(await owl.owner()).to.equal(owner.address);

  //   const balance0ETH = await waffle.provider.getBalance(owner.address);
  //   const mintTx = await owl.connect(addr1).sell_Mint({value:ethers.utils.parseEther("0.01")});
  //   // wait until the transaction is mined
  //   await mintTx.wait();
  //   const balance0ETH2 = await waffle.provider.getBalance(owner.address);
  //   expect(balance0ETH2.sub(balance0ETH)).to.equal(ethers.utils.parseEther("0.01"));
  //   // expect(await owl.balanceOf(addr1.address)).to.equal("1");

  //   // expect(await greeter.greet()).to.equal("Hello, world!");
  //   // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
  //   // // wait until the transaction is mined
  //   // await setGreetingTx.wait();
  //   // expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
  
});
