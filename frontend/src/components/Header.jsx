import React from 'react';
import { FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link} from 'react-router-dom'

function Header() {
    return (
        <header className='header'>
            <div className='log'>
                <Link to='/'>Personal Review</Link>
            </div>
            <ul>
                <li>
                    <Link to='/login'>
                        <FaSignInAlt/> Login
                    </Link>
                </li>
                <li>
                    <Link to='/register'>
                        <FaSignOutAlt/> Register
                    </Link>
                </li>
                <li>
                    <Link to='/profile'>
                        <FaUser/> Profile
                    </Link>
                </li>
            </ul>
        </header>
    )
}
export default Header
