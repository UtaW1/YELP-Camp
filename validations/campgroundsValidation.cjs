const {campgroundSchema} = require('../validationSchema.cjs'); 
const ExpressError = require('../utilities/expressError.cjs');


const validateCampground = (req, res, next) => {
    const {error}= campgroundSchema.validate(req.body); 
    console.log({error})
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}



module.exports = validateCampground; 
