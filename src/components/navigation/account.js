// Represent the display for the user's Metamask account

import React from 'react';
import Identicon from 'identicon.js';


class Account extends React.Component {
    render() {
        return(
        <ul className='navbar-nav px-3'>

            <li className='nav-item textnonwrap d-none d-sm-none d-sm-block'>
                <small className='text-secondary'>
                <small id='account'> { this.props.account } </small>
                </small>

                {this.props.account ?
                <img className='ml-2' width='30' height='30' 
                src={`data:image/png;base64, ${new Identicon(this.props.account, 30).toString()}`}
                alt='' /> : 
                <span></span> }

            </li>

            </ul>
        )
    }
}

export default Account
