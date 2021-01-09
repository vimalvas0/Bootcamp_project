const express = require('express');
const courseRouter = require('./courses');

const { protect, authorize } = require('../middlewares/auth');


//Fetch the set of fuctions from the file "/controllers/bootcamps"
const {
	getBootcamps,
	getBootcampId,
	deleteBootcamp,
 	updateBootcamp,
	createBootcamp,
	getBootcampByRadius,
	bootcampPhotoUpload
  } = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

// router.route() is used to move further in url given
// next comes a chain of get() post() delete() put()
// each of these methods take a middlewares which we take from controllers folder...

router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);


router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);


router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'),getBootcamps)
	.post(protect, authorize('publisher'), createBootcamp);

router
	.route('/:id')
	.get(getBootcampId)
	.put(protect, authorize('publisher'), updateBootcamp)
	.delete(protect, authorize('publisher'), deleteBootcamp);


	// router is sent 
module.exports = router;