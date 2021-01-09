const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

/*

@AUTHOR : Vimal Vashisth

*/

// @description        Register a user
// @routes             POST /api/auth/register
// @access             Public (requires no token)
exports.register =  asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);


    // const token = user.getSignJwtToken();

    // res.status(200).json({sucess : true, token});
});


// @description        Login a user
// @routes             POST /api/auth/login
// @access             public (requires no token
exports.login =  asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // Validate email and password
    if(!email || !password)
    {
        return next(new ErrorResponse('Please provide a valid email and password', 400));
    }


    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if(!user)
    {
        return next(new ErrorResponse('Invalid email or password'));
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch)
    {
        return next(new ErrorResponse('Invalid email or password'));      
    }

    sendTokenResponse(user, 200, res);

    // const token = user.getSignJwtToken();

    // res.status(200).json({sucess : true, token});
});

// @description        Forget password
// @routes             POST /api/auth/forgetPassword
// @access             public (requires no token
exports.forgotPassword = asyncHandler(async (req, res, next)=>{
    const user = await User.findOne({email : req.body.email});

    if(!user)
    {
        return next(new ErrorResponse(`There's no user with this email.`, 404));
    }

    //get reset token
    const getToken = user.getPasswordResetToken();

    await user.save({validateBeforeSave: false});

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${getToken}`;

    const message = `Someone has sent a request for reset of a password.
    Please make a PUT request to : \n\n ${resetUrl}`;

    try{
        await sendEmail({
            email : user.email,
            subject : 'password reset token',
            message
        });


        res.status(200).json({sucess : true, data: 'Email Sent'});
    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});
        return next(new ErrorResponse(`There was some problem in sending the Email`, 400));
    }

    console.log(getToken); 

    res.status(200)
        .json({
            success : true,
            data : user
        });
});

// @description        Reset Password
// @routes             PUT /api/auth/resetPassword/:resetToken
// @access             public (requires no token
exports.resetToken = asyncHandler( async (req, res, next)=>{

    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now() }
    });


    if(!user){
        return next(new ErrorResponse(`Invalid Token`, 400));
    }
                               
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});


// Get token from a model, create cookie and send response
const sendTokenResponse = (user, statusCode, res)=>{
    // create a token
   const token = user.getSignJwtToken();

   const options = {
       expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       httpOnly : true
   };

   res
   .status(statusCode)
   .cookie('token', token, options)
   .json({
       success : true,
       token
   });


};


// After login to check the identification
exports.getMe = asyncHandler( async (req, res, next)=>{
    const me = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        data : me
    });
});


// @description        Update details for user
// @routes             PUT /api/auth/updateDetails
// @access             public (requires no token
exports.updateDetails = asyncHandler( async (req, res, next)=>{
    const fields = { 
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fields, {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        success : true,
        data : user
    });
});


// @description        Update password for user
// @routes             PUT /api/auth/updatePassword
// @access             public (requires no token
exports.updatePassword = asyncHandler( async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.currentPassword)))
    {
        return next(new ErrorResponse('Incorrect Password', 400));
    }

    req.user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});





