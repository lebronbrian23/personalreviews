const asyncHandler = require('express-async-handler')

const Review = require('../models/reviewModel')

/**
 * @description Gets live reviews
 * @route GET /api/reviews
 * @access Private
 */
const getReviews = asyncHandler(async ( req, res) => {
    const reviews = await Review.find({ status: 'live' })
    res.status(200).json(reviews)
})

/**
 * @description Set reviews
 * @route POST /api/reviews
 * @access Private
 */
const addReviews = asyncHandler(async ( req, res) => {
    if(!req.body.description){
        res.status(400)
        throw new Error('Please add a description');
    }
    const review = await Review.create({
        description : req.body.description,
        rating: req.body.rating,
        reviewee_id: req.body.reviewee_id,
        reviewer_id: req.body.reviewer_id
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
 * @route DELEETE /api/reviews/:id
 * @access Private
 */
const deleteReview = asyncHandler(async ( req, res) => {
    const review = await Review.findById(req.params.id)
    //check if review exists
    if(!review){
        res.status(400)
        throw new Error('Review not found')
    }
    const deletedReview = await Review.updateOne({
        status :'down'
    })

    res.status(200).json(deletedReview)
})

module.exports = {
    getReviews, addReviews ,updateReview ,deleteReview
}
