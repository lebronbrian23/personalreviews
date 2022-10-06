import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {verifyUserOTP , resendCode , reset} from "../features/auth/authSlice";
import {Link, useNavigate} from "react-router-dom";

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
        <div className="mt-10 max-w-md mx-auto">
            <div className="w-full bg-white shadow-md rounded px-8 pb-8 mb-4">
                <p className="mt-10 max-w-md mx-auto text-center text-2xl font-semibold">
                    Verify Account
                </p>
                <p className='mt-5 max-w-md mx-auto text-center text-xs'>Please enter code sent to your phone.</p>
                <form onSubmit={onsubmit} className="pt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                            Code <sup className='text-red-700 text-lg'>*</sup>
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text' name='code' id='code' value={code} placeholder='Enter Code' onChange={(e) => setCode(e.target.value)}/>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Verify
                        </button>
                    </div>
                    <div className="mb-4 mt-2">
                        <p className="text-center text-gray-500 text-sm">
                            Didn't receive code?
                            <Link
                                  className='inline-block align-baseline text-sm text-blue-400 hover:text-blue-400'onClick={onResendCode}>Resend code</Link>
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

export default VerifyOtp
