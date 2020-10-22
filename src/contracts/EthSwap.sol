pragma solidity^0.5.0;

import "./Token.sol";


contract EthSwap  {
    string public name = "Uniswap 2.0";
    Token public token;
    uint public conversion_rate = 100;

    event TokenPurchased(address account, address token, uint amount, uint rate);
    event TokenSold(address account, address token, uint amount, uint rate);


    constructor(Token _token) public {
        token = _token;
    }


    function buyTokens() public payable {
        // ETH / DApp conversion
        uint tokenAmount = msg.value * conversion_rate;
        require(token.balanceOf(address(this)) >= tokenAmount); // if exchange has enough DApp funds, continute. else, abort

        token.transfer(msg.sender, tokenAmount);

        // event confirmation
        emit TokenPurchased(msg.sender, address(token), tokenAmount, conversion_rate);
    }


    function sellTokens(uint _amount) public payable {
        
        // this is already programmed into the ETH protocol ... might get rid of later
        require(token.balanceOf(msg.sender) >= _amount); // user can't sell more tokens than they have

        // DApp / ETH conversion
        uint ETHAmount = _amount / conversion_rate;

        require(address(this).balance >= ETHAmount); // if exchange has enough ETH funds, continue. else, abort

        // perform sale
        token.transferFrom(msg.sender, address(this), _amount); // investor sends DApp to exchange
        msg.sender.transfer(ETHAmount); // send ETH to investor

        // event confirmation
        emit TokenSold(msg.sender, address(token), _amount, conversion_rate);
    }
}