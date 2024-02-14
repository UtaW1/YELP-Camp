const Review = require('../models/review.cjs')


const isReviewAuthor = async(req, res, next) => {
    const {reviewId, id} = req.params; 
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`); 
    }
    next(); 
}

module.exports = isReviewAuthor; 