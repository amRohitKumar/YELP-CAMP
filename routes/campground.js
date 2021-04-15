const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const campGround = require('../models/campground');
const {campgroundSchema} = require('../joi/schemas');



const validateCampground = (req, res, next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    // console.log(result.error.details);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground ,catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    const { title, location, price, description, image } = req.body.campground;
    const newCampGround = new campGround({ title: title, location: location, image: image, price: price, description: description });
    await newCampGround.save();
    req.flash('success', 'Successfully made a new Campground !');
    res.redirect(`/campgrounds/${newCampGround._id}`);
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const reqcampground = await campGround.findById(id);
    if(!reqcampground){
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {reqcampground});
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id).populate('reviews');
    if(!reqcampground){
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { reqcampground });
}))

router.delete('/:id',catchAsync(async (req, res) => {
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}))

router.put('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const { title, location, price, image, description } = req.body.campground;
    await campGround.findByIdAndUpdate(id, {title: title, location: location, price: price, description: description, image: image});
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;