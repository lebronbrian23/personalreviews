import React, {useEffect, useState} from 'react';
import {useSelector ,useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {resetPassword, reset} from "../features/auth/authSlice";
import {FaKeyboard} from "react-icons/fa";
import Spinner from "../components/Spinner";

function ResetPassword () {
    const [formData , setFormData] = useState({
        username: '',
        code: '',
        password:'',
        confirm_password:''
    })

    const {  username , code , password ,confirm_password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isLoading , isError, isSuccess , message } = useSelector(
        (state) => state.auth )

    useEffect(()=> {
            if (isError) {
                toast.error(message)
            }
            if (isSuccess) {
                navigate('/login')
            }

            dispatch(reset())
        }
        , [isError, isSuccess , message , navigate ,dispatch]
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

        if(code.length !== 4) {
            toast.error('Code should be 4 digits')
        }else if(password !== confirm_password) {
            toast.error('Passwords don\'t match')
        }else {
            const formData = {
                 password , code, username
            }
            dispatch(resetPassword(formData))
        }
    }

    if(isLoading){
        return <Spinner/>
    }

    return <>
        <div className="mt-10 max-w-md mx-auto">
            <div className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4">
                <p className="mt-10 max-w-md mx-auto text-center text-2xl font-semibold">
                    Reset your password
                </p>
                <p className='mt-5 max-w-md mx-auto text-center text-xs'>Enter your new password.</p>
                <form onSubmit={onsubmit} className="pt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text' name='username' id='username' value={username} placeholder='Username' onChange={onChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                            Code <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='number' name='code' id='code' value={code} placeholder='Enter 4 digit code' onChange={onChange}/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" type="password" placeholder="*********" onChange={onChange} value={password} name='password'/>

                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_password">
                            Confirm Password <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" type="password" placeholder="*********" onChange={onChange} value={confirm_password} name='confirm_password'/>

                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Submit
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2022 All rights reserved.
                </p>
            </div>
        </div>
    </>

}

export default ResetPassword
