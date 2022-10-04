import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import reviewService from "./reviewService";

const initialState = {
    allReviews : [],
    reviewsToMe : [],
    reviewsToOthers : [],
    reviewsByUsername : [],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message: '',
    isNewReviewError:false,
    isNewReviewSuccess:false,
    isNewReviewLoading:false,
    newReviewMessage: ''
}
//create a review
export const createReview  = createAsyncThunk( 'reviews/create' ,async (reviewData , thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await reviewService.createReview(reviewData , token)
    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//get reviews
export const getReviews = createAsyncThunk('reviews/getAll', async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await reviewService.getReviews( token)
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//get reviews sent to me
export const getReviewsToMe = createAsyncThunk('reviews/get-all-to-me', async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await reviewService.getReviewsToMe( token)
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//get user reviews by username
export const getUserReviews = createAsyncThunk('reviews/get-by-username', async (username, thunkAPI) => {
    try{
        return await reviewService.getUserReviews(username)
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//get reviews i sent to others
export const getReviewsToOthers = createAsyncThunk('reviews/get-all-to-others', async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await reviewService.getReviewsToOthers( token)
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//delete a review
export const deleteReview = createAsyncThunk( 'review/delete',async (id,thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await reviewService.deleteReview(id , token )
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
export const reviewSlice = createSlice({
    name:'review',
    initialState,
    reducers:{
        reset:(state) => initialState
    },
    extraReducers: (builder) => {
        builder
            //create review case
            .addCase(createReview.pending,(state) => {
                state.isNewReviewLoading = true
            })
            .addCase(createReview.fulfilled, (state , action) => {
                state.isNewReviewLoading = false
                state.isNewReviewSuccess = true
                state.allReviews.push(action.payload)
            })
            .addCase(createReview.rejected , (state , action) => {
                state.isNewReviewLoading = false
                state.isNewReviewError = true
                state.newReviewMessage = action.payload
            })

            //get reviews case
            .addCase(getReviews.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getReviews.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.allReviews = action.payload
            })
            .addCase(getReviews.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //delete review case
            .addCase(deleteReview.pending,(state) => {
                state.isLoading = true
            })
            .addCase(deleteReview.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.allReviews = state.reviews.filter((review) => review.id !== action.payload._id)
            })
            .addCase(deleteReview.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //get reviews to me case
            .addCase(getReviewsToMe.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getReviewsToMe.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.reviewsToMe = action.payload
            })
            .addCase(getReviewsToMe.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            //get reviews to others case
            .addCase(getReviewsToOthers.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getReviewsToOthers.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.reviewsToOthers = action.payload
            })
            .addCase(getReviewsToOthers.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })


            //get reviews by username case
            .addCase(getUserReviews.pending,(state) => {
                state.isLoading = true
            })
            .addCase(getUserReviews.fulfilled, (state , action) => {
                state.isLoading = false
                state.isSuccess = true
                state.reviewsByUsername = action.payload
            })
            .addCase(getUserReviews.rejected , (state , action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = reviewSlice.actions
export default reviewSlice.reducer

