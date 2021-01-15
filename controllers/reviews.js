const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Courses = require('../models/Course');
const Review = require('../models/Review');

// @description        To get all the reviews
// @routes             GET /api/reviews
// @routes             GET /api/bootcamps/:bootcampId/reviews
// @access             Public (requires no token)
exports.getReviews = asyncHandler(async (req, res, next) =>{

    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp : req.params.bootcampId});

        res.status(200).json({
        success : true,
        numberOfCourses : reviews.length,
        data : reviews
        });
    }   
    else{
        res.status(200).json(res.advancedResults);
    }

});


// @description        To get single review
// @routes             GET /api/reviews/:id
// @access             Public (requires no token)
exports.getReviewById = asyncHandler(async (req, res, next) =>{

    const review = await Review.findById(req.params.id).populate({
        path : 'bootcamp',
        select : 'name description'
    });


    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id} `, 400));
    }

    res.status(200).json({
        success : true,
        data : review
    });

});

// @description        To create a review
// @routes             POST /api/bootcamps/:bootcampId/reviews
// @access             Private (requires no token)
exports.addReview = asyncHandler(async (req, res, next) =>{
    
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp)
    {
        next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success : true,
        data : review
    });

});

// @description        To update a review
// @routes             POST /api/review/:id
// @access             Private (requires no token)
exports.updateReview = asyncHandler(async (req, res, next) =>{
    
    let review = await Review.findById(req.params.id);

    if(!review)
    {
        next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
    }

    if(req.user.id !== review.user.toString() && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(
                `Not Authorized to review`,
                401
            )
        );
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    });

    res.status(201).json({
        success : true,
        data : review
    });

});


// @description        To delete a review
// @routes             POST /api/review/:id
// @access             Private (requires no token)
exports.deleteReview = asyncHandler(async (req, res, next) =>{
    
    let review = await Review.findById(req.params.id);

    if(!review)
    {
        next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
    }

    if(req.user.id !== review.user.toString() && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(
                `Not Authorized to review`,
                401
            )
        );
    }

    review = await Review.remove();

    res.status(201).json({
        success : true,
        data : review
    });

});