import React from 'react';
import { FaSignInAlt, FaPowerOff, FaUser} from 'react-icons/fa'
import {Link ,useNavigate} from 'react-router-dom'
import {useSelector , useDispatch} from "react-redux";
import {logout , reset } from '../features/auth/authSlice'

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }
    return (
        <header className='header'>
            <div className='log'>
                <Link to='/'>Personal Review</Link>
            </div>
            <ul>
                { user? (
                    <>
                        <li>
                            <Link to='/'>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to='/profile'>
                                 {user.name}
                            </Link>
                        </li>

                        <li>
                            <button className='btn' onClick={onLogout}>
                                <FaPowerOff/> Logout
                            </button>
                        </li>

                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                 Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                 Register
                            </Link>
                        </li>

                    </>
                )}

            </ul>
        </header>
    )
}
export default Header
