const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const user = require('../controllers/user');

router.get('/register', user.registerUserForm);

router.post('/register', catchAsync(user.registerUser));

router.get('/login', user.loginForm);

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,catchAsync(user.login));

router.get('/logout', user.logout);

module.exports = router