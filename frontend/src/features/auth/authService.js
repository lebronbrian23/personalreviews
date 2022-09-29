import axios from 'axios'

const API_URL = '/api/users/'

// register new user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//login a user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//logout user
const logout = () => {
    localStorage.removeItem('user')
}

//forgot Password
const forgotPassword = async (userData) => {
    const response = await axios.post(API_URL + 'forgot-password', userData)

    return response.data
}

//reset Password
const resetPassword = async (userData) => {
    const response = await axios.put(API_URL + 'reset-password', userData)

    return response.data
}

//verify User OTP
const verifyUserOTP = async ( code , token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.post(API_URL + 'verify-user-otp' , code ,config)
    if(response.data){
        localStorage.removeItem('user')

        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//resend User OTP
const resendCode = async ( token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.post(API_URL + 'resend-user-otp','' ,config)

    return response.data
}

const authService = { register , logout ,login ,forgotPassword ,resetPassword ,verifyUserOTP ,resendCode}

export default authService
