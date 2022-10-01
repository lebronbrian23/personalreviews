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

//get all reviews  sent to me
const getReviewsToMe = async ( token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL + 'to-me' ,config)

    return response.data
}

//get reviews by username
const getUserReviews = async ( username) => {
    const config = {
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL + 'get-user-reviews/'+username ,config)

    return response.data
}

//get all reviews i sent to others
const getReviewsToOthers = async ( token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json; charset=UTF-8",
        }
    }

    const response = await axios.get(API_URL + 'to-others',config)

    return response.data
}

const reviewService = {
    getReviewsToOthers,
    getReviewsToMe,
    getUserReviews,
    createReview,
    deleteReview,
    getReviews,
    }

export default reviewService
