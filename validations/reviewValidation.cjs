const {reviewSchema} = require('../validationSchema.cjs'); 
const ExpressError = require('../utilities/expressError.cjs');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body); 
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports = validateReview; 