const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./joi/schemas');
const methodOverride = require('method-override');
const campGround = require('./models/campground');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/expressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));






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

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground ,catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    const { title, location, price, description, image } = req.body.campground;
    const newCampGround = new campGround({ title: title, location: location, image: image, price: price, description: description });
    await newCampGround.save();
    res.redirect(`/campgrounds/${newCampGround._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const reqcampground = await campGround.findById(id);
    res.render('campgrounds/edit', {reqcampground});
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id);
    res.render('campgrounds/show', { reqcampground });
}))

app.delete('/campgrounds/:id',catchAsync(async (req, res) => {
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const { title, location, price, image, description } = req.body.campground;
    await campGround.findByIdAndUpdate(id, {title: title, location: location, price: price, description: description, image: image});
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (req, res, next) => {
    console.log('2');
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    console.log('1');
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Ohh no , Something went wrong !!";
    res.status(statusCode).render('error/error.ejs', {err});
    // res.send("SOMETHING WENT WRONG !!!");
})

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080 !!!");
})