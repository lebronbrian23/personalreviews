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

//get logged in user data
const getMe = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL+'me', config)

    return response.data
}

//get user by username
const getUserByUsername = async (username) => {
    const config = {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL+'u/'+username, config)

    return response.data
}

//search users
const searchUsers = async (search_query) => {
    const config = {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    }
    const {search , limit} = search_query

    const response = await axios.get(API_URL+'search-users?search='+search+'&limit='+limit, config)

    return response.data
}

const authService = {
    getUserByUsername,
    forgotPassword,
    resetPassword,
    verifyUserOTP,
    searchUsers,
    resendCode,
    register,
    logout,
    login,
    getMe
}

export default authService
