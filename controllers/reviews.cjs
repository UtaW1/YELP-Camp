const Campground = require('../models/campground.cjs'); 
const Review = require('../models/review.cjs'); 

module.exports.postReview = async(req, res) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id); 
    const newReview = new Review(req.body.review);  
    newReview.author = req.user._id
    campground.reviews.push(newReview); // if we didn't merge params this would be an empty object and we would get an error saying that reviews is null
    await newReview.save(); 
    await campground.save(); 
    req.flash('success', 'Successfully posted your review!')
    res.redirect(`/campgrounds/${campground._id}`); 
}

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params; 
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId); 
    req.flash('success', 'Successfully deleted your review!')
    res.redirect(`/campgrounds/${id}`)
}