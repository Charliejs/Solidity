const Dex = artifacts.require("Dex")
const Link1 = artifacts.require("Link")
const  truffleAssert = require('truffle-assertions');

contract( "Dex", accounts => {
    it("should throw an error If ETH is too low when creating a Buy Limit Order", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await truffleAssert.reverts(
           dex.createLimitOrder(0, web3.utils.fromUtf8("Link"),10,1)
        )
        dex.depositEth({value: 10})
        await truffleAssert.passes(
            dex.createLimitOrder(0, web3.utils.fromUtf8("Link"),10,1))
    })
    it("should throw an error If token balance is too low when creating a Sell Limit Order", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await truffleAssert.reverts(
           dex.createLimitOrder(1, web3.utils.fromUtf8("Link"),10,1)
        )
        await dex.addToken(web3.utils.fromUtf8("Link"), link.address)
        await link.approve(dex.address, 500)
        await dex.deposit(10, web3.utils.fromUtf8("Link"), {from: accounts[0]})
        await truffleAssert.passes(
            dex.createLimitOrder(1, web3.utils.fromUtf8("Link"),10,1)
        )
       
    })
    it("The Buy order book should be ordered on the price from the highest to the lowest starting from index 0", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await link.approve(dex.address, 500);
        dex.depositEth({value: 3000});
        dex.createLimitOrder(0, web3.utils.fromUtf8("Link"),10,300)
        dex.createLimitOrder(0, web3.utils.fromUtf8("Link"),10,200)
        dex.createLimitOrder(0, web3.utils.fromUtf8("Link"),10,100)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("Link"), 0);
        assert(orderbook.length > 0);
        for(let i = 0; i<=orderbook-1; i++){
            assert(orderbook[i].price >= orderbook[i+1].price, "not right order in buy book")
        }

    })
    it("The SELL order book should be ordered on the price from the lowest to the highest starting from index 0", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await link.approve(dex.address, 500)
        dex.createLimitOrder(1, web3.utils.fromUtf8("Link"),1,300)
        dex.createLimitOrder(1, web3.utils.fromUtf8("Link"),1,200)
        dex.createLimitOrder(1, web3.utils.fromUtf8("Link"),1,100)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("Link"), 1);
        assert(orderbook.length > 0);
        for(let i = 0; i<orderbook-1; i++){
            assert(orderbook[i].price <= orderbook[i+1].price, "not right order in sell book")
        }

    })


})
