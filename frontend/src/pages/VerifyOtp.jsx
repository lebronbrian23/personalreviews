import React, {useEffect, useState} from 'react';
import {FaFingerprint } from "react-icons/fa";
import Spinner from "../components/Spinner";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {verifyUserOTP , resendCode , reset} from "../features/auth/authSlice";
import {useNavigate} from "react-router-dom";

function VerifyOtp () {

    const [code , setCode] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const { user , isLoading , isError, isSuccess , message } = useSelector(
        (state) => state.auth )

    const onResendCode = () => {
        dispatch(resendCode())
    }

    useEffect(()=> {
            if (isError) {
                toast.error(message)
            }
            if (isSuccess || user) {

                if(user.verified === 'yes')
                    navigate('/')
                else
                    navigate('/verify-account')
            }

            dispatch(reset())
        }
        , [user, isError , isSuccess , message , navigate ,dispatch]
    )

    const onsubmit = (e) => {
        e.preventDefault()

        if(!code) {
            toast.error('Code is required')
        }
        else if(code.length !== 4) {
            toast.error('Code should be 4 digits')
        }
        else {
            dispatch(verifyUserOTP({code}))
        }
    }

    if(isLoading){
        return <Spinner/>
    }
    return <>
        <section className='heading'>
            <h1>
                <FaFingerprint/> Verify Account
            </h1>
            <p>Please enter code sent to your phone</p>

            <section className='form'>
                <form onSubmit={onsubmit}>
                    <div className="form-group">
                        <input className='form-control' type='number' name='code' id='code' value={code}
                               placeholder='Enter code' onChange={(e) => setCode(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <button type='submit' className='btn btn-block'>Verify</button>
                    </div>
                </form>
                <div className="">
                    <p>Didn't receive code? <button onClick={onResendCode}>Resend code</button></p>
                </div>
            </section>
        </section>
    </>

}

export default VerifyOtp
