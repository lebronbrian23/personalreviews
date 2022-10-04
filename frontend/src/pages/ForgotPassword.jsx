import React, {useEffect, useState} from 'react';
import {FaKey} from "react-icons/fa";
import {useSelector ,useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {forgotPassword ,reset} from "../features/auth/authSlice";
import {} from "react-icons/fa";
import Spinner from "../components/Spinner";

function ForgotPassword () {
    const [username , setUsername] = useState('')


    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isLoading , isError, isSuccess , message } = useSelector(
        (state) => state.auth )

    useEffect(()=> {
            if (isError) {
                toast.error(message)
            }
            if (isSuccess) {
                navigate('/reset-password')
            }

            dispatch(reset())
        }
        , [isError, isSuccess , message , navigate ,dispatch]
    )
    const onsubmit = (e) => {
        e.preventDefault()

        if(username)
            dispatch(forgotPassword({username}))
    }

    if(isLoading){
        return <Spinner/>
    }

    return <>
        <div className="mt-10 max-w-md mx-auto">
            <div className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4">
                <p className="mt-10 max-w-md mx-auto text-center text-2xl font-semibold">
                    Forgot your password?
                </p>
                <p className='mt-5 max-w-md mx-auto text-center text-xs'>A password reset code will be sent to you.</p>
                <form onSubmit={onsubmit} className="pt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text' name='username' id='username' value={username} placeholder='Username' onChange={(e) => setUsername( e.target.value)}/>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Submit
                        </button>
                    </div>
                    <div className="mb-4 mt-2">
                        <p className="text-center text-gray-500 text-sm">
                            Already have an account?
                            <Link to='/login'
                                  className='inline-block align-baseline text-sm text-blue-400 hover:text-blue-400'>Login</Link>
                        </p>
                        <p className="text-center text-gray-500 text-sm">
                            Don't have an account yet?
                            <Link className='inline-block align-baseline text-sm text-blue-400 hover:text-blue-400'
                                  to='/register'>Register</Link>
                        </p>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2022 All rights reserved.
                </p>
            </div>
        </div>
    </>

}

export default ForgotPassword
