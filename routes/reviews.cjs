const express = require('express'); 
const router = express.Router({mergeParams: true}); // we need this arg because by default our router and index page will have different req.params and that is where we're getting our ID from 
const validateReview = require('../validations/reviewValidation.cjs'); 
const asyncWrapper = require('../utilities/catchAsync.cjs'); 
const isLoggedIn = require('../validations/isLoggedIn.cjs')
const isReviewAuthor = require('../validations/isReviewAuthor.cjs')

const reviews = require('../controllers/reviews.cjs'); 

router.post('/', isLoggedIn ,validateReview ,asyncWrapper(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,asyncWrapper(reviews.deleteReview)); 

module.exports = router; 