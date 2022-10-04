import  {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import authService from "./authService";

// get user from local storage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    userData: '',
    userProfileData: '',
    searchResults: '',
    isError:false,
    isSuccess:false,
    isLoading:false,
    mesaage:''

}

// register a new user
export  const register = createAsyncThunk('/auth/register', async (user,thunkAPI) => {
    try {
        return await authService.register(user)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


// login a  user
export const login = createAsyncThunk('/auth/login', async (user,thunkAPI) => {
    try {
        return await authService.login(user)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//logout user
export const logout = createAsyncThunk('auth/logout', async  () => {
    await authService.logout()
})

// forgot user password
export const forgotPassword = createAsyncThunk('auth/forgot-password', async (userData,thunkAPI) => {
    try {
        return await authService.forgotPassword(userData)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// reset user password
export const resetPassword = createAsyncThunk('auth/reset-password', async (userData,thunkAPI) => {
    try {
        return await authService.resetPassword(userData)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//verify user OTP
export const verifyUserOTP = createAsyncThunk('auth/verify-code', async  (code, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.verifyUserOTP( code , token)

    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//resend user OTP
export const resendCode = createAsyncThunk('auth/resend-code', async  (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.resendCode(token)

    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//update  user data
export const updateUser = createAsyncThunk( 'auth/update-me' ,async (formData ,thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await authService.updateUser(formData , token)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


//get logged in user data
export const getMe = createAsyncThunk( 'auth/get-me' ,async (_ ,thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await authService.getMe(token)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//get user by username
export const getUserByUsername = createAsyncThunk( 'auth/get-user-by-username' ,async (username ,thunkAPI) => {
    try{
        return await authService.getUserByUsername(username)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//search users
export const searchUsers = createAsyncThunk( 'auth/search-users' ,async (search_query ,thunkAPI) => {
    try{
        return await authService.searchUsers(search_query)
    }catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        reset:(state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.mesaage = ''
            state.userData = ''
            state.userProfileData = ''
            state.searchResults = ''

        }
    },
    extraReducers: (builder) => {
        builder
            //register cases
            .addCase(register.pending, (state) =>{
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })

            //login cases
            .addCase(login.pending, (state) =>{
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })

            //logout case
            .addCase(logout.fulfilled , (state ) => {
                state.user = null
            })

            //forgot password cases
            .addCase(forgotPassword.pending,(state) => {
                state.isLoading = true
            })
            .addCase(forgotPassword.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(forgotPassword.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //reset password cases
            .addCase(resetPassword.pending,(state) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(resetPassword.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //verify user otp cases
            .addCase(verifyUserOTP.pending,(state) => {
                state.isLoading = true
            })
            .addCase(verifyUserOTP.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
                state.user = action.payload
            })
            .addCase(verifyUserOTP.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //resend user otp cases
            .addCase(resendCode.pending,(state) => {
                state.isLoading = true
            })
            .addCase(resendCode.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(resendCode.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //get logged user data
            .addCase(getMe.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getMe.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userData = action.payload
            })
            .addCase(getMe.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.userData = ''
            })

            //update user data
            .addCase(updateUser.pending,(state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(updateUser.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //get user by username
            .addCase(getUserByUsername.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getUserByUsername.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userProfileData = action.payload
            })
            .addCase(getUserByUsername.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //search users
            .addCase(searchUsers.pending,(state) => {
                state.isLoading = true
            })
            .addCase(searchUsers.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.searchResults = action.payload
            })
            .addCase(searchUsers.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})


export const {reset} = authSlice.actions

export default authSlice.reducer
