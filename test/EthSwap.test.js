// Testing the EthSwap protocol

const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");


require('chai')
    .use(require('chai-as-promised'))
    .should()


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}


contract('EthSwap', ([deployer, investor]) => {

    let token, ethSwap;

    // setting testing variables
    before(async() => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)

        // transfering total supply of tokens to EthSwap
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    // token functionality
    describe('Token deployment', async() => {

        // name test
        it('Token contract has a name', async () => {
            const token_name = await token.name()
            assert.equal(token_name, 'DApp Token')
        })
    })
    

    // EthSwap functionality
    describe('EthSwap deployment', async() => {

        //  name test
        it('Ethswap contract has a name', async () => {
            const ethSwap_name = await ethSwap.name()
            assert.equal(ethSwap_name, 'Uniswap 2.0')
        })
        
        // token transfer test
        it('Ethswap contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    // buying tokens on the exchange
    describe('buyTokens() function', async () => {

        let result, purchase_event;

        // setting testing variables
        before(async () => {
            result = await ethSwap.buyTokens({
                from: investor,
                value: tokens('1')
            })

            purchase_event = result.logs[0].args
        })

        // investor balance after purhcase
        it('INVESTOR BALANCE: Allows purchase of DApp tokens for ETH at a fixed conversion rate', async () => {
            // DApp balance
            let investor_DAPP_bal = await token.balanceOf(investor) 
            assert.equal(investor_DAPP_bal.toString(), tokens('100'))
        })

        // exhcange balance after purchase
        it('EXCHANGE BALANCE: Allows purchase of DApp tokens for ETH at a fixed conversion rate', async () => {
            // DApp balance
            let exchange_DAPP_bal = await token.balanceOf(ethSwap.address)
            assert.equal(exchange_DAPP_bal.toString(), tokens('999900'))

            // ETH balance
            let exchange_ETH_bal = await web3.eth.getBalance(ethSwap.address)
            assert.equal(exchange_ETH_bal.toString(), tokens('1'))
        })

        // event confirmation
        it('Event confirmation for token purchase', async () => {
            assert.equal(purchase_event.account, investor)
            assert.equal(purchase_event.token, token.address)
            assert.equal(purchase_event.amount.toString(), tokens('100'))
            assert.equal(purchase_event.rate.toString(), '100')
        })

         // valid purchases
         it('Token amount exceeds exchange capacity', async () => {
            // CHECK
        })
    })


    // selling tokens on the exchange
    describe('sellTokens() function', async () => {

        let result, sale_event;

        // setting test variables
        before(async () => {
            // investor approves token transaction
            await token.approve(ethSwap.address, tokens('100'), { from: investor })
            // investor sells token
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })

            sale_event = result.logs[0].args
        })

        // investor balance after purhcase
        it('INVESTOR BALANCE: Allows sale of DApp tokens for ETH at a fixed conversion rate', async () => {
            // DApp balance
            let investor_DAPP_bal = await token.balanceOf(investor) 
            assert.equal(investor_DAPP_bal.toString(), tokens('0'))
        })

        // exhcange balance after purchase
        it('EXCHANGE BALANCE: Allows sale of DApp tokens for ETH at a fixed conversion rate', async () => {
            // DApp balance
            let exchange_DAPP_bal = await token.balanceOf(ethSwap.address)
            assert.equal(exchange_DAPP_bal.toString(), tokens('1000000'))

            // ETH balance
            let exchange_ETH_bal = await web3.eth.getBalance(ethSwap.address)
            assert.equal(exchange_ETH_bal.toString(), tokens('0'))
        })

        // event confirmation
        it('Event confirmation for token sale', async () => {
            assert.equal(sale_event.account, investor)
            assert.equal(sale_event.token, token.address)
            assert.equal(sale_event.amount.toString(), tokens('100'))
            assert.equal(sale_event.rate.toString(), '100')
        })

        // valid purchases
        it('Investor cannot sell more tokens than they have', async () => {
            await ethSwap.sellTokens(tokens('500'), { from: investor}).should.be.rejected
        })
    })
})