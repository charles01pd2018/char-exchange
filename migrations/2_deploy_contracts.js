const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {

    // Token Contract
    await deployer.deploy(Token);
    const token = await Token.deployed()

    // Exchange Contract
    await deployer.deploy(EthSwap, token.address)
    const ethSwap = await EthSwap.deployed()

    // Transfer all tokens to EthSwap (totalSupply in Token.sol)
    await token.transfer(ethSwap.address, '1000000000000000000000000')

};
