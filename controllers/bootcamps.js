
// @description        To get all the bootcamps
// @routes             GET /api/bootcamps
// @access             Public (requires no token)
exports.getBootcamps = (req, res, next)=>{
	res.status(400).json({"success" : false, "data" : null});
}



// @description        To get a bootcamps with id 
// @routes             GET /api/bootcamps
// @access             Public (requires no token)
exports.getBootcampId = (req, res, next)=>{
	res
	.status(200)
	.json({"success" : true, "data" : `This is bootcamp (GET) ${req.params.id}`});
}



// @description        To update a bootcamps with id
// @routes             PUT /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.updateBootcamp = (req, res, next)=>{
	res.status(200).json({"success" : true, "data" : `This is bootcamp (UPDATE) ${req.params.id}`});
}



// @description        To create a bootcamps with id
// @routes             POST /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.createBootcamp = (req, res, next)=>{
	res.status(200)
	.json({"success" : true, "data" : `This is bootcamp (POST) ${req.params.id}`});
}



// @description        To delete a bootcamps with id
// @routes             DELETE /api/bootcamps/:id
// @access             PRIVATE (requires  token)
exports.deleteBootcamp = (req, res, next)=>{
	res
	.status(200)
	.json({"success" : true, "data" : `This is bootcamp (DELETE) ${req.params.id}`});
}



