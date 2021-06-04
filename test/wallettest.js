const Dex = artifacts.require("Dex")
const Link1 = artifacts.require("Link")
const  truffleAssert = require('truffle-assertions');
contract( "Dex", accounts => {
    it("should only be for owner to add token", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("Link"), link.address, {from: accounts[0]})
        )
    })
    it("should handle deposits correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await link.approve(dex.address, 500)
        await dex.deposit(100, web3.utils.fromUtf8("Link"))
        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("Link"))
        assert.equal(balance.toNumber(), 100)
            
    })
    it("should handle faulty withdraw correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await truffleAssert.reverts(dex.withdraw(200, web3.utils.fromUtf8("Link")))
                  
    })
    it("should handle correct withdraw correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link1.deployed()
        await truffleAssert.passes(dex.withdraw(100, web3.utils.fromUtf8("Link")))
          
    })
    
})