const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResposnse = require('../utils/ErrorResponse');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');


// Protect routes 
exports.protect = asyncHandler(async (req, res, next) =>{
    let token;


    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    )
    {
        token = req.headers.authorization.split(' ')[1];
    }


    // else if(req.cookies.token){
        // token = req.cookies.token;
    // }

    // Make sure token exists
    if(!token){
        return next(new ErrorResponse(`Not Authorize to access this route` ,401));
    }

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    }
    catch(err){
        return next(new ErrorResponse(`Not Authorize to access this route` ,401));
    }
    
});

// Authorized user only
exports.authorize = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`A ${req.user.id} is not authorize to perform this operation`, 401));
        }

        next();
    };
};