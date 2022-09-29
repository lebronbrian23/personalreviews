import axios from 'axios'

const API_URL = '/api/reviews/'

//create a review
const createReview = async ( reviewData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.post(API_URL , reviewData ,config)

    return response.data
}

//get all reviews
const getReviews = async ( token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL ,config)

    return response.data
}

//delete a review
const deleteReview = async ( id , token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.delete(API_URL + id ,config)

    return response.data
}
const reviewService = { createReview , getReviews ,deleteReview}

export default reviewService
