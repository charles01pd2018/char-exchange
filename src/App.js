import React from 'react';
import Web3 from 'web3';

// contracts
import Token from './abis/Token.json';
import EthSwap from './abis/EthSwap.json';

// components
import Navbar from './components/navigation/navbar';
import Main from './components/main';


class App extends React.Component {

  // loads Metamask web browser instance
  async loadWeb3() {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }

    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }

    else {
      window.alert('Non-Ethereum browser detected. Use Metamask extension to continue!')
    }
  }


// loads data from the blockchain from the user's Metamask account
  async loadBlockchainData() {
    const web3 = window.web3

    // user account wallet address
    let account = await web3.eth.getAccounts()
    this.setState({ account: account [0] }) 
    
    // user ETH balance
    let ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance: ethBalance })

    // logs
    console.log(`Wallet address: ${ account[0] }`)
    console.log(`ETH amount: ${ ethBalance }`)


    // loading token
    const netID = await web3.eth.net.getId()
    const token_data = Token.networks[netID]

    if (token_data) {
      // setting the token contract
      let token = web3.eth.Contract(Token.abi, token_data.address)
      this.setState({ token })

      // setting the user's token balance
      let token_balance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: token_balance.toString() })
    }
     else
      window.alert('Token contract not deployed to detected network')
    
    // logs
    console.log(`Token contract: ${ this.state.token }`)
    console.log(`User token balance: ${ this.state.tokenBalance }`)
    
    
    // loading EthSwap
    const ethSwap_data = EthSwap.networks[netID]
    
    if (ethSwap_data) {

      let ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwap_data.address)
      this.setState({ ethSwap })
    }
    else 

      window.alert('Ethswap contract no deployed to detected network.')
    
    // logs
    console.log(`EthSwap contract: ${ this.state.ethSwap }`)

    this.setState({ loading: false })
  }


  // awaits browser component dependencies
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

    console.log(window.web3)
    }  

  // buying DApp tokens on the exchange
  buyTokens = ( etherAmount ) => {

    this.setState( { loading: true } )

    this.state.ethSwap.methods.buyTokens()
      .send( { value: etherAmount, from: this.state.account} )
      .on('transactionHash', ( hash ) => {

        this.setState( { loading: false } )
      })
  }


  constructor(props) {

    super(props)

    this.state = {

      account: '',
      ethBalance: '0',
      tokenBalance: '0',
      token: {},
      ethSwap: {},
      loading: true
    }
  }


  render() {

    return (
      <div>
        
        <Navbar account={this.state.account}/>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={ {maxWidth: '45rem'}  }>
              <div className="content mr-auto ml-auto">

                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {this.state.loading ? 
                ( <p id='loader' className='text-center'> Loading... </p> ) : 
                ( <Main ethBalance={this.state.ethBalance} tokenBalance={this.state.tokenBalance} buyTokens={this.buyTokens} /> ) } 
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App
