import {createRequire} from 'module'
const require = createRequire(import.meta.url)


const mongoose = require('mongoose'); 
const cities = require('./cities.cjs'); 
const {descriptors, places} = require('./seedHelpers.cjs')
const Campground = require('../models/campground.cjs'); 

mongoose.set('strictQuery', true); 
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:")); 
db.once("open", () => {
    console.log("Database successfully connected")
})

const sampleRandomizer = array => {
    return array[Math.floor(Math.random() * array.length)]
}
const seedDB = async() => {
    await Campground.deleteMany({}); 
    for(let i = 0; i <= 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 30) + 10; 
        const camp = new Campground({
            author: '641f14045a3207fb0ca35c60', 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sampleRandomizer(descriptors)} ${sampleRandomizer(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptatum, dolorem labore reprehenderit quis temporibus ullam atque adipisci porro excepturi! Maiores quis repudiandae, deleniti corporis quisquam deserunt. Iusto, mollitia aut!',
            price: randPrice, 
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [
            {
                url: 'https://res.cloudinary.com/dvsz9pudp/image/upload/v1700127784/YelpCamp/akw8oofxtbcqer2xeh9n.jpg',
                filename: 'YelpCamp/kazvmopkqwfwfkjtwkue'
            }
            ]

        })
        await camp.save(); 
    } 
}

seedDB().then(() => {
    mongoose.connection.close(); // makes it instantly close the connection with mongo after saving
})