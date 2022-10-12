const asyncHandler = require('express-async-handler')
const moment = require('moment')
const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {sendSMS} = require("./otpController");


/**
 * @description Gets live reviews sent to me
 * @route GET /api/reviews/to-me
 * @access Private
 */
const getReviewsToMe = asyncHandler(async ( req, res) => {
    res.status(200).json(await getReviewsByUser(req.user.id, 'reviewee'))
})

/**
 * @description Gets user's live reviews sent to them
 * @route GET /api/reviews/get-user-reviews/:username
 * @access Public
 */
const getUserReviews = asyncHandler(async ( req, res) => {
    const user = await User.findOne({username:req.params.username})
    if (user)
        res.status(200).json(await getReviewsByUser(user._id, 'reviewee'))
})

/**
 * @description Gets live reviews by user
 */
const getReviewsByUser = async (user_id , type) => {

    const reviews = type === 'reviewee'
        ? await Review.find({ status: 'live' ,reviewee_id : user_id}).sort({createdAt: 'descending'})
        : (type === 'reviewer' ? await Review.find({ status: 'live' ,reviewer_id : user_id }).sort({createdAt: 'descending'})
            : await Review.find({ status: 'live' }).sort({createdAt: 'descending'}) )

    const reviews_array = []
    // for loop to iterate through each review
    for (const index in reviews) {
        //get the reviewer
        const reviewer = await User.findById(reviews[index].reviewer_id)
        //get the reviewee
        const reviewee = await User.findById(reviews[index].reviewee_id)

        reviews_array.push({
            id:reviews[index]._id,
            reviewer:reviewer.name,
            reviewer_username:reviewer.username,
            reviewer_id:reviews[index].reviewer_id,
            description:reviews[index].description,
            rating:reviews[index].rating,
            order_no:reviews[index].order_no,
            status:reviews[index].status,
            createdAt:moment(reviews[index].createdAt).format("MMM D YYYY"),
            reviewee: type !== 'reviewee' && reviewee.name  ,
            reviewee_username:type !== 'reviewee' && reviewee.username,
            reviewee_id:type !== 'reviewee' && reviews[index].reviewee_id,
        })
    }

    return reviews_array
}

/**
 * @description Gets live reviews sent to others
 * @route GET /api/reviews/to-others
 * @access Private
 */
const getReviewsToOthers = asyncHandler(async ( req, res) => {
    res.status(200).json(await getReviewsByUser(req.user.id, 'reviewer'))
})

/**
 * @description Set reviews
 * @route POST /api/reviews
 * @access Private
 */
const addReviews = asyncHandler(async ( req, res) => {

    //get id of logged in user
    const reviewer_id = req.user.id

    //check the user type of the logged in user to see if there admins
    if(req.type.name !== 'general') {
        res.status(400)
        throw new Error('You can\'t perform this action')
    }
    const  {description ,rating,reviewee_id ,order_no} = req.body
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
        order_no: order_no,
        reviewee_id: reviewee_id,
        reviewer_id: reviewer_id
    })

    res.status(200).json(review)
})

/**
 * @description Gets live reviews
 * @route GET /api/reviews
 * @access Private | Backend
 */
const getReviews = asyncHandler(async ( req, res) => {
    res.status(200).json(await getReviewsByUser('', 'all'))
})

/**_______________________________________
 *  For Backend
 ________________________________________*/

/**
 * @description Update reviews
 * @route PUT /api/reviews/:id
 * @access Private | Backend
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
 * @access Private | Backend
 */
const deleteReview = asyncHandler(async ( req, res) => {

    //check the user type of the logged in user to see if there admins or moderator
    if(req.type.name === 'admin' || req.type.name === 'moderator') {

        const review = await Review.findById(req.params.id)
        //check if review exists
        if (!review) {
            res.status(400)
            throw new Error('Review not found')
        }
        //update the review
        const updateReview = await Review.findOneAndUpdate(
            {_id: req.params.id},
            {status: 'down'},
            {returnOriginal: false}
        )

        res.status(200).json(updateReview)
    }else {
        res.status(400)
        throw new Error('Only Admins and Moderators can perform this action')
    }

})

module.exports = {
    addReviews,
    getReviews,
    deleteReview,
    updateReview,
    getUserReviews,
    getReviewsToMe,
    getReviewsToOthers
}
