const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campGround = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware/middleware');
const campground = require('../controllers/campground');

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, validateCampground, catchAsync(campground.create))

router.get('/new', isLoggedIn, campground.newForm);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm))

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))
    .put(isLoggedIn, isAuthor, catchAsync(campground.updateCampground))

module.exports = router;