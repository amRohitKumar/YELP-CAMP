const Review = require('../models/review');
const campGround = require('../models/campground');


module.exports.createReview = async (req, res) => {
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
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}