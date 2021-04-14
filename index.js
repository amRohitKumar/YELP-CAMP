const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/expressError');

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');

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


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


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