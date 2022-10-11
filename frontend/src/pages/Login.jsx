import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {login, reset} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Login () {

    const [formData , setFormData] = useState({
        username:'',
        password:'',
    })

    const {  username , password  } = formData
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading , isError, isSuccess , message } = useSelector(
        (state) => state.auth )

    useEffect(()=> {
            if (isError) {
                toast.error(message)
            }

            if (isSuccess || user) {
                if(user) {
                    if (user.verified === 'yes')
                        navigate('/dashboard')
                    else
                        navigate('/verify-account')
                }else
                    navigate('/login')
            }

            dispatch(reset())
        }
        , [user , isError, isSuccess , message , navigate ,dispatch]
    )

    //function to enable entering data in form fields
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onsubmit = (e) => {
        e.preventDefault()

        const userData = {
            username,
            password
        }

        dispatch(login(userData))
    }

    if(isLoading){
        return <Spinner/>
    }

    return <>
        <div className="row" style={{margin: '-2.5em'}}>
            <div className="col-md-6 d-none d-lg-block d-md-block"
                 style={{ backgroundImage: `url("/login-infographic.jpg")`, height: '100vh', backgroundRepeat: 'no-repeat',backgroundSize: 'cover',}}>
            </div>
            <div className="col-md-6 col-sm-12 ">
                <div className="mt-10 max-w-md mx-auto">
                    <div className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4">
                        <p className="mt-10 max-w-md mx-auto text-center text-2xl font-semibold">
                            Please login to your account
                        </p>
                        <form onSubmit={onsubmit} className="pt-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username <sup className='text-red-700 text-lg'>*</sup>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type='text' name='username' id='username' value={username} placeholder='Username' onChange={onChange}/>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password <sup className='text-red-700 text-lg'>*</sup>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password" type="password" placeholder="*********" onChange={onChange} value={password} name='password'/>

                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit">
                                    Sign In
                                </button>
                                <Link className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-400"
                                      to='/forgot-password'>
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="mb-4 mt-2">
                                <p className="text-center text-gray-500 text-xs">
                                    Don't have an account yet? <Link className='inline-block align-baseline text-sm text-blue-400 hover:text-blue-400' to='/register'>Register</Link>
                                </p>
                            </div>
                        </form>
                        <p className="text-center text-gray-500 text-xs">
                            &copy;2022 All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>

}

export default Login
