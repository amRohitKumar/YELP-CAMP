const campGround = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res) => {
    const { title, location, price, description, image } = req.body.campground;
    const newCampGround = new campGround({ title: title, location: location, image: image, price: price, description: description });
    newCampGround.author = req.user._id;
    await newCampGround.save();
    req.flash('success', 'Successfully made a new Campground !');
    res.redirect(`/campgrounds/${newCampGround._id}`);
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { reqcampground });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const reqcampground = await campGround.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(reqcampground);
    if (!reqcampground) {
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { reqcampground });
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const { title, location, price, image, description } = req.body.campground;
    await campGround.findByIdAndUpdate(id, {title: title, location: location, price: price, description: description, image: image})
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${id}`);
}