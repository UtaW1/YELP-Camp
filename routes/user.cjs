const express = require('express'); 
const router = express.Router(); 
const asyncWrapper = require('../utilities/catchAsync.cjs')
const passport = require('passport')


const user = require('../controllers/user.cjs')

router.route('/register')
    .get(user.renderRegister) 
    .post(asyncWrapper(user.userRegister))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', {failureFlash : true, failureRedirect: 'login', keepSessionInfo: true}) , asyncWrapper(user.userLogin))// keepSessionInfo is important for redirectUrl to work since after login / logout our prev session will be destroyed so the OR operator will always go to campgrounds instead of the origianlUrl that we specified (for version 0.6 ^)

router.get('/logout', user.userLogout)


module.exports = router; 