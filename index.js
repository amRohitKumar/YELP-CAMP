const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const campGround = require('./models/campground');

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





app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    // console.log(req.body);
    const { title, location, price, description, image } = req.body.campground;
    const newCampGround = new campGround({ title: title, location: location, image: image, price: price, description: description });
    await newCampGround.save();
    res.redirect(`/campgrounds/${newCampGround._id}`);
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const reqcampground = await campGround.findById(id);
    res.render('campgrounds/edit', {reqcampground});
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id);
    res.render('campgrounds/show', { reqcampground });
})

app.delete('/campgrounds/:id',async (req, res) => {
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const { title, location } = req.body.campground;
    await campGround.findByIdAndUpdate(id, {title: title, location: location});
    res.redirect(`/campgrounds/${id}`);
})



app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080 !!!");
})