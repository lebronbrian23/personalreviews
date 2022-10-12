import React from 'react';
import {useState , useEffect}   from "react";
import {useSelector ,useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {register ,reset} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Register () {
    const [formData , setFormData] = useState({
        name:'',
        username:'',
        email:'',
        phone:'',
        password:'',
        confirm_password:'',
    })

    const { name , email , username , phone , password , confirm_password } = formData

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
                    if(user.verified === 'yes')
                        navigate('/')
                    else
                        navigate('/verify-account')
                }else
                    navigate('/register')
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

        if(!name)
            toast.error('Name is required')
        else if(!phone)
            toast.error('Phone is required')
        else if(!email)
            toast.error('Email is required')
        else if(!username)
            toast.error('Username is required')
        else if(!password)
            toast.error('Password is required')
        else if(password !== confirm_password)
            toast.error('Passwords don\'t match')
        else {
            const userData = {
                name, email, password, phone, username
            }

            dispatch(register(userData))
        }

    }

    if(isLoading){
        return <Spinner/>
    }

    return <>
        <div className="row" style={{margin: '-2.5em'}}>
            <div className="col-md-6 d-none d-lg-block d-md-block"
                 style={{ backgroundImage: `url("/register-infographics.jpg")`,  backgroundRepeat: 'no-repeat',backgroundSize: 'cover',}}>
            </div>
            <div className="col-md-6 col-sm-12 ">
                <div className="mt-10 max-w-md mx-auto">
            <div className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4">
                <p className="mt-10 max-w-md mx-auto text-center text-2xl font-semibold">
                   Register for an account
                </p>
                <form onSubmit={onsubmit} className="pt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text' name='name' id='name' value={name} placeholder='Name' onChange={onChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Phone <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='number' name='phone' id='phone' value={phone} placeholder='14160000000' onChange={onChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text' name='email' id='email' value={email} placeholder='email@example.com' onChange={onChange}/>
                    </div>
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
                            Sign Up
                        </button>
                    </div>
                    <div className="mb-4 mt-2">
                        <p className="text-center text-gray-500 text-sm">
                           Already have an account? <Link className='inline-block align-baseline text-sm text-blue-400 hover:text-blue-400' to='/login'>Login</Link>
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

export default Register
