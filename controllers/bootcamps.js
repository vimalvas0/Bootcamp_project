const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const geocoder = require('../utils/geocoder');
const { remove } = require('../models/Bootcamp');
const { QueryCursor } = require('mongoose');


// Bunch of middlewares defined and made available to use by exports.nameOfMiddleware = (){}

// @description        To get all the bootcamps
// @routes             GET /api/bootcamps
// @access             Public (requires no token)
exports.getBootcamps = asyncHandler(async (req, res, next)=>{
		res.status(200).json(res.advancedResults);
});



// @description        To get a bootcamps with id 
// @routes             GET /api/bootcamps
// @access             Public (requires no token)
exports.getBootcampId = asyncHandler(async (req, res, next)=>{

			const bootcamp = await Bootcamp.findById(req.params.id);

			if(!bootcamp){
				return next(new ErrorResponse(`Cannot find the bootcamp with id of ${req.params.id}`, 404));
			}
			
			res
			.status(200)
			.json({"success" : true, "data" : bootcamp});
});



// @description        To update a bootcamps with id
// @routes             PUT /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.updateBootcamp = asyncHandler(async (req, res, next)=>{

		let bootcamp = await Bootcamp.findById(req.params.id);

		if(!bootcamp){
			return new ErrorResponse(`Cannot find a bootcamp with id of ${req.params.id}`, 404);
		}

		// Let's check if the publisher is changing the bootcamp
		if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
		{
			return next(new ErrorResponse(`${req.user.name} is not the course publisher to update.`, 401));
		}

		bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new : true,
			runValidators : true
		});

		res.status(200).json({"success": true, "data": bootcamp});

});



// @description        To create a bootcamps with id
// @routes             POST /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.createBootcamp = asyncHandler(async (req, res, next)=>{
	
	//Put the user on the req.body
	req.body.user = req.user.id;

	// Check if the bootcamp already existy by this user
	const whichBootcamp = await Bootcamp.findOne({user : req.user.id});

	// If not admin then he cannot publish more than one
	if(whichBootcamp && req.body.role!='admin'){
		return next(new ErrorResponse(`User with ID ${req.body.user} cannot have more than one course`, 401));
	}

	const bootcamp = await Bootcamp.create(req.body);

	res.status(200)
	.json({"success" : true, "data" : bootcamp });

	
});



// @description        To delete a bootcamps with id
// @routes             DELETE /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.deleteBootcamp = asyncHandler(async (req, res, next)=>{
	
		const bootcamp = await Bootcamp.findById(req.params.id);

		if(!bootcamp){
			return new ErrorResponse(`Cannot find a bootcamp with id of ${req.params.id}`, 404);
		}

		// Let's check if the publisher is changing the bootcamp
		if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
		{
			return next(new ErrorResponse(`${req.user.name} is not the course publisher to delete.`, 401));
		}

		bootcamp.remove();

		res.status(200).json({"success": true, "data": {}});
});


// @description        To delete a bootcamps with radius
// @routes             DELETE /api/bootcamps/radius/:zipcode/:distance
// @access             PRIVATE (requires  token)
exports.getBootcampByRadius = asyncHandler(async (req, res, next)=>{

	//fetch the zipcode and distance from the parameters
	const { zipcode, distance } = req.params;

	const loc = await geocoder.geocode(zipcode);

	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	//Calculate the radius ---  I do not know how it works
	const radius = distance/ 3963;

	const bootcamp = await Bootcamp.find({
		location : {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
	});

	res.status(200).json({
		"success" : true,
		"count" : bootcamp.length,
		"data" : bootcamp
	});

});


// @description        To upload a photo
// @routes             DELETE /api/bootcamps/radius/:zipcode/:distance
// @access             PRIVATE (requires  token)
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next)=>{

	const bootcamp = await Bootcamp.findById(req.params.id);


	if(!bootcamp)
	{
		return next(
			 new ErrorResponse(`There's no bootcamp with the id of ${req.params.id}`, 404)
		);
	}

	if(!req.files)
	{
		return next(
			new ErrorResponse(`Please upload a file`, 400)
		);
	}

	const file = req.files.file;


	// Check if the file is image
	if(!file.mimetype.startsWith('image')){
		return next(new ErrorResponse(`Please upload a image.`, 400));
	}

	// Check file size
	if(!file.size > process.env.FILE_SIZE)
	{
		return next(new ErrorResponse(`Please upload a file size less than ${process.env.FILE_SIZE}`, 400));
	}

	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if(err)
		{
			console.error(err);
			return next(
				new ErrorResponse(`Some problem uploading the file.`, 400)
			);
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo : file.name
		});

		res.status(200).json({
			success : true,
			data : file.name
		});
	});

});



