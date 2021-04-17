const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware/middleware');
const reviewCampground = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviewCampground.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(reviewCampground.deleteReview));

module.exports = router;