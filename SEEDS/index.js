const mongoose = require('mongoose');
const campGround = require('../models/campground');
const path = require('path');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })

const db = mongoose.connection;

const sample = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async () => {
    await campGround.deleteMany({});
    for(let i = 0; i< 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;

        const camp = new campGround({
            author: '60792c3ea6f87a08cc10b081',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/400x300',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt doloribus earum, repellat accusantium perspiciatis debitis repellendus ad consectetur eum, dolores impedit sequi, deleniti vitae quis.',
            price: price
        })
        await camp.save();
    }
    
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })