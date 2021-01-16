const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const advancedResults = require('../middlewares/advancedResults')


// @description        Get all user
// @routes             GET /api/auth/users
// @access             Private
exports.getUsers =  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


// @description        Get a user by id
// @routes             GET /api/auth/users/:id
// @access             Public (requires no token)
exports.getUserById =  asyncHandler(async (req, res, next) => {
    
    
    const user = await User.findById(req.params.id);
    
    res.status(200).json({
        success : true,
        data : user
    });
});


// @description        Create a user 
// @routes             GET /api/auth/users/:id
// @access             Public (requires no token)
exports.createUser =  asyncHandler(async (req, res, next) => {
    
    
    const user = await User.create(req.body);
    
    res.status(201).json({
        success : true,
        data : user
    });
});


// @description        Update a user 
// @routes             GET /api/auth/users/:id
// @access             Public (requires no token)
exports.updateById =  asyncHandler(async (req, res, next) => {
    
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });
    
    res.status(200).json({
        success : true,
        data : user
    });
});


// @description        Delete a user 
// @routes             DELETE /api/auth/users/:id
// @access             Private (requires no token)
exports.deleteUser =  asyncHandler(async (req, res, next) => {
    
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success : true,
        data : user
    });
});



