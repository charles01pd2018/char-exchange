import React from 'react';

// components
import Account from './account';


class Navbar extends React.Component { 

  render() { 
    return (

      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

        <h1 className="navbar-brand col-sm-3 col-md-2 mr-0" >
          CHAR Exchange
        </ h1>
        
        <Account account={ this.props.account }/>

        </nav>
    )
  }
}

export default Navbar