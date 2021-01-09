const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Courses = require('../models/Course');


// @description        To get all the courses
// @routes             GET /api/courses
// @routes             GET /api/bootcamps/:bootcampId/courses
// @access             Public (requires no token)
exports.getCourses = asyncHandler(async (req, res, next) =>{

    if(req.params.bootcampId){
        const courses = await Courses.find({bootcamp : req.params.bootcampId});

        res.status(200).json({
        success : true,
        numberOfCourses : courses.length,
        data : courses
        });
    }   
    else{
        res.status(200).json(res.advancedResults);
    }

});


// @description        To get course by id
// @routes             GET /api/courses/:courseId
// @access             Public (requires no token)
exports.getCoursesById = asyncHandler(async (req, res, next) =>{

    const course = await (await Courses.findById(req.params.id)).populate({
        path : 'bootcamp',
        select : 'name description'
    });

    if(!course){
        return next(new ErrorResponse(`This course do not exist`, 400));
    }

    res.status(200).json({
        success : true,
        data : course
    });

});


// @description        To create a course
// @routes             POST /api/bootcamps/:bootcampId/courses      -     Know that we are adding a course to a bootcamp
// @access             POST (requires  token)
exports.createCourse = asyncHandler(async (req, res, next) =>{

    req.body.bootcamp =  req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No Bootcamp exist with id of ${req.params.bootcampId}`, 400));
    }

    // Let's check if the publisher is changing the bootcamp
	if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
	{
		return next(new ErrorResponse(`${req.user.name} is not the authorized to create a course in bootcamp ${req.params.bootcampId}.`, 401));
	}

    const course = await Courses.create(req.body);

    res.status(200).json({
        success : true,
        data : course
    });

});



// @description        To update a course 
// @routes             PUT /api/courses/:id
// @access             POST (requires no token)
exports.updateCourse = asyncHandler(async (req, res, next) =>{

    let course = await Courses.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`There's no course to replace with id ${req.params.id}`, 400));
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin')
	{
		return next(new ErrorResponse(`${req.user.name} is not the authorized to update a course in bootcamp ${req.params.bootcampId}.`, 401));
	}

    course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        success : true,
        data : course
    });
});

// @description        To delete a course 
// @routes             DELETE /api/courses/:id
// @access             POST (requires no token)
exports.deleteCourse = asyncHandler(async (req, res, next) =>{

    let course = await Courses.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`There's no course to replace with id ${req.params.id}`, 400));
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin')
	{
		return next(new ErrorResponse(`${req.user.name} is not the authorized to delete a course in bootcamp ${req.params.bootcampId}.`, 401));
	}

    await course.remove()

    res.status(200).json({
        success : true,
        data : course
    });
});