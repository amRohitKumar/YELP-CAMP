const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const campGround = require('../models/campground');
const { campgroundSchema } = require('../joi/schemas');
const { isLoggedIn } = require('../middleware/middleware');


const validateCampground = (req, res, next) => {

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

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    else{
        if (reqcampground.author === req.user._id) {
            // await campGround.findByIdAndUpdate(id, { title: title, location: location, price: price, description: description, image: image });
            res.render('campgrounds/edit', { reqcampground });
        } else {
            req.flash('error', "You are not the author of this campground !");
            res.redirect(`/campgrounds/${id}`);
        }
    }
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id).populate('reviews').populate('author');
    console.log(reqcampground);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { reqcampground });
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const findCampground = await campGround.findById(id);
    if (findCampground.author === req.user._id) {
        await campGround.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground');
        res.redirect('/campgrounds');
    } else {
        req.flash('error', "You don't have the permission to delete this campground !");
        res.redirect('/campgrounds');
    }
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, price, image, description } = req.body.campground;
    const findCampground = await campGround.findById(id);
    if (findCampground.author === req.user._id) {
        await campGround.updateOne(id, { title: title, location: location, price: price, description: description, image: image })
        req.flash('success', 'Successfully Updated Campground');
        res.redirect(`/campgrounds/${id}`);
    } else {
        req.flash('error', "You are not the author of this campground !");
        res.redirect(`/campgrounds/${id}`);
    }
}))


module.exports = router;