const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.post('/register', async (req, res) => {
    // ROUTE FOR REGISTRATION OF NEW USER
    try {
        const {username, email, password} = req.body;
        const newUser = new User({email: email, username: username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash('success', 'Welcome to Yelp-Camp');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
})

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,async (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye !');
    res.redirect('/campgrounds');
})

module.exports = router