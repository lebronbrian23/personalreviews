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
        <section className='heading'>
            <h1>
                <FaKey/> Forgot your password?
            </h1>
            <p>Enter your username and we will send you a password reset code.</p>

            <section className='form'>
                <form onSubmit={onsubmit}>
                    <div className="form-group">
                        <input className='form-control' type='text' name='username' id='username' value={username}
                               placeholder='Enter your username' onChange={(e) => setUsername( e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <button type='submit' className='btn btn-block'>Submit</button>
                    </div>

                </form>
                <div className="">
                    <p>Already have an account? <Link to='/login'>Login</Link></p>
                    <p>Don't have an account yet? <Link to='/register'>Register</Link></p>
                </div>
            </section>
        </section>
    </>

}

export default ForgotPassword
