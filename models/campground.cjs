const mongoose = require('mongoose'); 
const Review = require('./review.cjs')
const Schema = mongoose.Schema; 

const opts = {toJSON: {virtuals: true}}; 


const ImageSchema = new Schema({
    url: String, //(this is called 'path' when you console.log the req.body and req.files)
    filename: String //(this is called 'filename')
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_130'); //this refers to this instance of ImageSchema
})

const CampgroundSchema = new Schema({
    title: String, 
    image: [ImageSchema], 
    geometry: { // geoJSON, this is an industry standard; type has to be POINT and coords has to be stored as an array
        type: {
            type: String,
            enum: ['Point'], // this is the only option
            required: true
        },
        coordinates: {
            type: [Number], // this too, the only option 
            required: true
        }
    },
    price: Number, 
    description: String, 
    location: String, 
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,40)}...</p>
    ` 
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) { // doc is pretty much going to be what was deleted in this case it will be a campground
        await Review.deleteMany({ // we need to remove the reviews associated with those campgrounds because we don't want orphans
            _id: {
                $in: doc.reviews // special query where we will remove the id of the reviews that is inside of the campground that we're deleting 
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)