import React, {useEffect, useState} from 'react';
import {useSelector ,useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
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
        <section className='heading'>
            <h1>
                <FaKeyboard/> Reset your password
            </h1>
            <p>Enter your new password.</p>

            <section className='form'>
                <form onSubmit={onsubmit}>
                    <div className="form-group">
                        <input className='form-control' type='text' name='username' id='username' value={username}
                               placeholder='Enter your username' onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input className='form-control' type='number' name='code' id='code' value={code}
                               placeholder='Enter 4 digit code' onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input className='form-control' type='password' name='password' id='password' value={password}
                               placeholder='Enter your new password' onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input className='form-control' type='password' name='confirm_password' id='confirm_password' value={confirm_password}
                               placeholder='Confirm your new password' onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <button type='submit' className='btn btn-block'>Submit</button>
                    </div>

                </form>

            </section>
        </section>
    </>

}

export default ResetPassword
