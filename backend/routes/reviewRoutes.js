const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {
    getReviews ,
    addReviews ,
    updateReview ,
    deleteReview ,
    getReviewsToMe ,
    getReviewsToOthers } = require('../controllers/reviewController');


router.route('/').get( getReviews ).post( addReviews);

router.get('/to-me', protect ,getReviewsToMe)

router.get('/to-others', protect ,getReviewsToOthers)

router.route('/:id').put(updateReview).delete( deleteReview);

module.exports = router