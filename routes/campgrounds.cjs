const express = require('express'); 
const router = express.Router({mergeParams: true}); 
const asyncWrapper = require('../utilities/catchAsync.cjs'); 
const validateCampground = require('../validations/campgroundsValidation.cjs')
const isLoggedIn = require('../validations/isLoggedIn.cjs'); 
const isAuthor = require('../validations/isAuthor.cjs'); 
const {storage} = require('../cloudinary/index.cjs')

const multer = require('multer')
const upload = multer({storage})

const campgrounds = require('../controllers/campgrounds.cjs')


router.route('/')
    .get(asyncWrapper(campgrounds.index))
    .post(isLoggedIn ,upload.array('image'),asyncWrapper(campgrounds.postForm)) 
    

router.get('/new', isLoggedIn , campgrounds.newForm); 

router.route('/:id')
    .get(asyncWrapper(campgrounds.showCampground))
    .put(isLoggedIn , isAuthor ,upload.array('image'),asyncWrapper(campgrounds.putCampground))
    .delete(isLoggedIn , isAuthor ,asyncWrapper(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn , isAuthor ,asyncWrapper(campgrounds.editForm)); 



module.exports = router; 