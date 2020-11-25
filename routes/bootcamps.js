const express = require('express');

const {
	getBootcamps,
	getBootcampId,
	deleteBootcamp,
 	updateBootcamp,
  	createBootcamp,
  } = require('../controllers/bootcamps');

const router = express.Router();


router
	.route('/')
	.get(getBootcamps);

router
	.route('/:id')
	.get(getBootcampId)
	.put(updateBootcamp)
	.post(createBootcamp)
	.delete(deleteBootcamp);

module.exports = router;