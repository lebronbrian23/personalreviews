const express = require('express');
const router = express.Router();
const { getReviews , addReviews ,updateReview ,deleteReview } = require('../controllers/reviewController');


router.route('/').get( getReviews ).post( addReviews);

router.route('/:id').put(  updateReview).delete( deleteReview);

module.exports = router
