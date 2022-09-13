const asyncHandler = require('express-async-handler')
/**
 * @description Gets reviews
 * @route GET /api/reviews
 * @access Private
 */
const getReviews = asyncHandler(async ( req, res) => {
    res.status(200).json({message : 'Get Reviews'})
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
    res.status(200).json({'message':'Set Reviews'})
})

/**
 * @description Update reviews
 * @route PUT /api/reviews/:id
 * @access Private
 */
const updateReview = asyncHandler(async ( req, res) => {
    res.status(200).json({'message':`Updated Review ${req.params.id}`})
})

/**
 * @description Delete reviews
 * @route DELEETE /api/reviews/:id
 * @access Private
 */
const deleteReview = asyncHandler(async ( req, res) => {
    res.status(200).json({'message':`Deleted Review ${req.params.id}`})
})

module.exports ={
    getReviews, addReviews ,updateReview ,deleteReview
}
