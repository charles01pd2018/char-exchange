import React from 'react';
import Web3 from 'web3';

// components
import Navbar from './components/navbar'


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
    
    // user account wallet address
    let account = await window.web3.eth.getAccounts()
    this.setState({ account: account [0] }) 
    
    // user ETH balance
    let ethBalance = await window.web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance: ethBalance })

    console.log(`Wallet Address: ${ account [0] }`)
    console.log(`ETH Amount: ${ ethBalance }`)
  }


  // awaits browser component dependencies
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

    console.log(window.web3)
    }  


  constructor(props) {

    super(props)

    this.state = {
      account: '',
      ethBalance: '0'
    }
  }


  render() {
    return (
      <div>
        
        <Navbar account={this.state.account}/>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1> Yuhurd </h1>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
