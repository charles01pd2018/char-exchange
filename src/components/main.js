import React from 'react';

// components
import BuyForm from './forms/buy-form';
import SellForm from './forms/sell-form';


class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state= {
            currentForm: 'buy'
        }
    }

  render() {
    return (
      <div id='contert' className='mt-3'>

          <div className='d-flex justify-content-between mb-3'>

              <button className='btn btn-light' onClick={ ( event ) => this.setState( { currentForm: 'buy' })}>
                  Buy
              </button>

              <button className='btn btn-light' onClick={ ( event ) => this.setState( { currentForm: 'sell' })}>
                  Sell
              </button>
          </div>

        <div className='card mb-4'>
            <div className='card-body'>

                {this.state.currentForm==='buy' ? 
                ( <BuyForm ethBalance={this.props.ethBalance} tokenBalance={this.props.tokenBalance} buyTokens={this.props.buyTokens} /> ) :
                (<SellForm ethBalance={this.props.ethBalance} tokenBalance={this.props.tokenBalance} sellTokens={this.props.sellTokens} />)}

            </div>
        </div>
      </div>
    )
  }
}

export default Main
