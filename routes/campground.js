const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campGround = require('../models/campground');
const { isLoggedIn , validateCampground, isAuthor} = require('../middleware/middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { title, location, price, description, image } = req.body.campground;
    const newCampGround = new campGround({ title: title, location: location, image: image, price: price, description: description });
    newCampGround.author = req.user._id;
    await newCampGround.save();
    req.flash('success', 'Successfully made a new Campground !');
    res.redirect(`/campgrounds/${newCampGround._id}`);
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { reqcampground });
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(reqcampground);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { reqcampground });
}))

router.delete('/:id', isLoggedIn, isAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}))

router.put('/:id', isLoggedIn, isAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, price, image, description } = req.body.campground;
    const findCampground = await campGround.findByIdAndUpdate(id, {title: title, location: location, price: price, description: description, image: image})
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;