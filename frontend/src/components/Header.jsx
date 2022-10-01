import React, {useState} from 'react';
import { FaPowerOff} from 'react-icons/fa'
import {Link ,useNavigate} from 'react-router-dom'
import {useSelector , useDispatch} from "react-redux";
import {logout , reset } from '../features/auth/authSlice'

function Header() {
    const [search , setSearch] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/login')
    }

    const onSearch = (e) => {
        e.preventDefault()

        if(search) {
            navigate({
                pathname: '/search-users',
                search: '?limit=15&search='+ search,
            })
        }
        setSearch('')
    }
    return (
        <header className='header'>
            <div className='log'>
                <Link to={ user ? '/dashboard' : '/login'}>Personal Review</Link>
            </div>

            { user && (
                <form onSubmit={onSearch}>
                    <div className='form-group'>
                        <input className='form-group' type='text' name='search' id='search'  value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <button type='submit' className='btn'>Search</button>
                    </div>
                </form>
                )}

            <ul>
                { user? (
                    <>
                        <li>
                            <Link to='/dashboard'>
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
