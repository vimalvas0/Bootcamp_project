const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add an name']
    },
    email : {
        type : String,
        required : [true, 'Please add a mail'],
        unique : true,
        match : [
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
             'Please use a valid email'
        ]
    },
    role : {
        type : String,
        enum : ['user', 'publisher', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true, 'Pleasse a password'],
        minlength : 6,
        select : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
});

// Encrypt password using bcrypt 
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
});

// Get JWT token
UserSchema.methods.getSignJwtToken = function(){
    return jwt.sign({ id : this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_DATE
    });
}

// Match a password
UserSchema.methods.matchPassword = async function(somePassword){
    return await bcrypt.compare(somePassword, this.password);
}


//Generate and hash password token
UserSchema.methods.getPasswordResetToken = function()
{
    //Generate a token
    const token = crypto.randomBytes(20).toString('hex');


    //Hash token and set to resetPassword field
    this.resetPasswordToken = crypto.createHash('sha256')
                                    .update(token)
                                    .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return token;
}


module.exports = mongoose.model('User', UserSchema);