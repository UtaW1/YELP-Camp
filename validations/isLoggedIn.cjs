const isLoggedIn = (req, res, next) => {
    const {id} = req.params
    if(!req.isAuthenticated()) { // built-in passport feature it
        req.session.returnTo = (req.query._method === 'DELETE') ? `/campgrounds/${id}`: req.originalUrl // orginalUrl will be the path that we clicked on before we got redirected
        req.flash('error', 'You must be signed in to access this feature!'); 
        return res.redirect('/login'); // we have to return to make sure the code below won't run
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    next();
}

module.exports = isLoggedIn; 


