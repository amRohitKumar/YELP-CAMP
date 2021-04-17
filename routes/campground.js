const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campGround = require('../models/campground');
const { isLoggedIn , validateCampground, isAuthor} = require('../middleware/middleware');
const campground = require('../controllers/campground');

router.get('/', catchAsync(campground.index));

router.get('/new', isLoggedIn, campground.newForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campground.create));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm))

router.get('/:id', catchAsync(campground.showCampground));

router.delete('/:id', isLoggedIn, isAuthor ,catchAsync(campground.deleteCampground));

router.put('/:id', isLoggedIn, isAuthor ,catchAsync(campground.updateCampground));


module.exports = router;