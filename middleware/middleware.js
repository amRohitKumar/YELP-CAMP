const campGround = require('../models/campground')
const Review = require('../models/review');
const { campgroundSchema } = require('../joi/schemas');
const ExpressError = require('../utilities/expressError');
const {reviewSchema} = require('../joi/schemas');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You mut be signedin');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    // console.log(result.error.details);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campGround.findById(id);
    // console.log(campground.author, req.user._id);
    // use .equals not !===
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that !");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that !");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}