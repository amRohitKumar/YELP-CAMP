const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const campGround = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware/middleware');



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    // res.send('working post on review');
    const {id} = req.params;
    const campground = await campGround.findById(id);
    const {rating, body} = req.body.review;
    const newReview = new Review({body: body, rating: rating});
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;