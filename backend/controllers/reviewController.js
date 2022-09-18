const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Review = require('../models/reviewModel')
const User = require('../models/userModel')

/**
 * @description Gets live reviews
 * @route GET /api/reviews
 * @access Private
 */
const getReviews = asyncHandler(async ( req, res) => {
    const reviews = await Review.find({ status: 'live' })
    res.status(200).json({reviews})
})

/**
 * @description Gets live reviews sent to me
 * @route GET /api/reviews/to-me
 * @access Private
 */
const getReviewsToMe = asyncHandler(async ( req, res) => {
    const reviews = await Review.find({ status: 'live' ,reviewee_id : req.user.id})
    res.status(200).json({reviews})
})


/**
 * @description Gets live reviews sent to others
 * @route GET /api/reviews/to-others
 * @access Private
 */
const getReviewsToOthers = asyncHandler(async ( req, res) => {
    const reviews = await Review.find({ status: 'live' ,reviewer_id : req.user.id})
    res.status(200).json({reviews})
})


/**
 * @description Set reviews
 * @route POST /api/reviews
 * @access Private
 */
const addReviews = asyncHandler(async ( req, res) => {
    const  {description ,rating,reviewee_id ,reviewer_id} = req.body
    //check if description is in body
    if(!description){
        res.status(400)
        throw new Error('Please add a description');
    }
    //check if reviewee_id is in body
    if(!reviewee_id){
        res.status(400)
        throw new Error('Please add a reviewee_id');
    }
    //check if reviewer_id is in body
    if(!reviewer_id){
        res.status(400)
        throw new Error('Please add a reviewer_id');
    }
    // here i limit the number of reviews posted on a user's profile by the same person in 24hrs
    //get current date
    let current_date = moment().format('YYYY-MM-DD')

    //check for the last review
    const check_last_posted_review = await Review.findOne({reviewee_id ,reviewer_id}).sort({ createdAt: 'desc' })

    //if a review exists
    if(check_last_posted_review) {
        //get the date when it was created
        let last_review_created_date = moment(check_last_posted_review.createdAt).format('YYYY-MM-DD')
        //check if the created date  is equal to current data
        if (last_review_created_date === current_date) {
            res.status(400)
            throw new Error('You can only make one review to this profile in 24hrs')
        }
    }
    //create a review
    const review = await Review.create({
        description : description,
        rating: rating,
        reviewee_id: reviewee_id,
        reviewer_id: reviewer_id
    })

    res.status(200).json(review)
})

/**
 * @description Update reviews
 * @route PUT /api/reviews/:id
 * @access Private
 */
const updateReview = asyncHandler(async ( req, res) => {
    const review = await Review.findById(req.params.id)
    //check if review exists
    if(!review){
        res.status(400)
        throw new Error('Review not found')
    }
    const updatedReview = await Review.findByIdAndUpdate(req.params.id , req.body,{
        new: true
    })
    res.status(200).json(updatedReview)
})

/**
 * @description Delete reviews
 * @route DELETE /api/reviews/:id
 * @access Private
 */
const deleteReview = asyncHandler(async ( req, res) => {
    const review = await Review.findById(req.params.id)
    //check if review exists
    if(!review){
        res.status(400)
        throw new Error('Review not found')
    }
    //update the review
    const updateReview = await Review.findOneAndUpdate({_id:req.params.id} ,{status :'down'} , {returnOriginal: false})

    res.status(200).json(updatReview)
})

module.exports = {
    getReviews, addReviews ,updateReview ,deleteReview,getReviewsToMe,getReviewsToOthers
}
