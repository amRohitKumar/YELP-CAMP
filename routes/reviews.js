const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const campGround = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const {reviewSchema} = require('../joi/schemas');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    // res.send('working post on review');
    const {id} = req.params;
    const campground = await campGround.findById(id);
    const {rating, body} = req.body.review;
    const newReview = new Review({body: body, rating: rating});
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;