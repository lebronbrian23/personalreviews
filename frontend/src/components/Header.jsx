import React, {useState} from 'react';
import {FaBars, FaTimes} from 'react-icons/fa'
import {Link ,useNavigate} from 'react-router-dom'
import {useSelector , useDispatch} from "react-redux";
import {logout , reset } from '../features/auth/authSlice'
import NavItem from "./NavItem";

function Header() {
    const [showNav, setShowNav] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        navigate('/')

    }

    return (
        <>
            <header className='mb-xxl-1'>
                <nav className="navbar navbar-expand-lg fixed-top navbar-dark header-bg-color">
                    <div className="container-fluid">
                        <Link className='navbar-brand px-4 text-decoration-none' to={ user ? '/dashboard' : '/login'}>Personal Review</Link>
                        <button type="button" className="navbar-toggler" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse">
                            {showNav ? (
                                <span><FaTimes
                                    onClick={() => setShowNav(!showNav)}
                                    className="cursor-pointer"
                                /></span>
                            ) : (
                                <span><FaBars
                                    onClick={() => setShowNav(!showNav)}
                                    className="cursor-pointer"
                                />
                            </span>
                            )}
                        </button>

                        <div className="collapse navbar-collapse m-3 justify-content-center" id="navbarCollapse">
                            <div className="navbar-nav">
                                { user? (
                                    <>
                                        <NavItem content="Home" href="/dashboard" />
                                        { user.user_type === 'admin' && <NavItem content="Users" href="/Users" /> }
                                        <NavItem content={user.name} href="/profile" />
                                        <button className='nav-item nav-link text-white px-4 text-white' onClick={onLogout}>
                                                Logout
                                        </button>

                                    </>
                                ) : (
                                    <>
                                        <NavItem content="Login" href="/login" />
                                        <NavItem content="Register" href="/register" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            </>
    )
}
export default Header
