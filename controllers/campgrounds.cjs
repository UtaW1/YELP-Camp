const Campground = require('../models/campground.cjs'); 
const {cloudinary} = require('../cloudinary/index.cjs');
const mapBoxToken = process.env.MAPBOX_KEY; 
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken : mapBoxToken})

module.exports.index = (async(req, res) => {
    const allCampgrounds = await Campground.find({})
    res.render('campgrounds/index', {allCampgrounds}) // second parameter we're sending it back to our views
})

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.postForm = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location, 
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground); // the campground that is after req.body comes from the fact that the "name" value of our form is also called campgrounds
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f => ({
        url: f.path, filename: f.filename
    }))
    campground.author = req.user._id; 
    await campground.save();
    req.flash('success', 'Successfully made a new campground!'); 
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res) => {
    const { id } = req.params
    const detailCampground = await Campground.findById(id).populate({
        path:'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author'); // we populate with whatever property that has the name on our THIS model (campground.cjs)
    if(!detailCampground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/details', {detailCampground});
}

module.exports.editForm = async(req, res) => {
    const detailCampground = await Campground.findById(req.params.id)
    if(!detailCampground) {
        req.flash('error', 'Campground not found!'); 
        return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/edit', {detailCampground})
}

module.exports.putCampground = async(req, res) => {
    const {id} = req.params; 
    const change = {...req.body.campground} 
    const updatedCampground = await Campground.findByIdAndUpdate(id, change);
    const imgs = req.files.map(f => ({
        url: f.path, filename: f.filename
    }));
    updatedCampground.image.push(...imgs);
    await updatedCampground.save()
    if (req.body.deleteImages) {
        await updatedCampground.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages }}}})
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);
}

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id); 
    req.flash('success', 'Successfully deleted your campground!')
    res.redirect('/campgrounds')
}

