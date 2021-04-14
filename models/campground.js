const mongoose = require('mongoose');
const { campgroundSchema } = require('../joi/schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const campGround = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

campGround.post('findOneAndDelete', async function(campground){
    // console.log(campground);
    if(campground){
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }
    
})

module.exports = mongoose.model('campGround', campGround);