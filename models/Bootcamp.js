const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const Course = require('./Course');

const BootcampSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [50, 'Name should be less than 50 characters']
    },
    slug : String,
    description : {
        type : String, 
        required : [50, 'Pleae provide a description'],
        maxlength : [200, 'Descripton should be less than 200 characters.']
    },
    website : {
        type : String,
        match : [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    email : {
        type : String,
        match : [
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Please use a valid email'
        ]
    },
    address : {
        type : String,
        required : [true, 'Please enter a proper address.']
    },
    location : {
        type:{
            type: String,
            enum: ['Point']
        },
        coordinates:{
            type: [Number],
        },
        formattedAddress : String,
        street : String,
        city : String,
        zipcode : String,
        state : String,
        country : String
    },
    careers : {
        type : [String],
        required : true,
        enum : [
            'Computer Science',
            'Mathematics',
            'Literature'
        ]
    },
    averageRating : {
        type : Number,
        min : [1, 'Min is 1'],
        max : [10, 'Max rating can be 10']
    },
    averageCost : Number,
    photo : {
        type : String,
        default : 'no-photo.jpg' 
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
}, {
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
});


BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower : true});
    next();
})

// For creating the location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type : 'Point',
        coordinates : [loc[0].longitude, loc[0].latitude],
        formattedAddress : loc[0].formattedAddress,
        street : loc[0].streetName,
        city : loc[0].city,
        state: loc[0].stateCode,
        zipcode : loc[0].zipcode,
        country : loc[0].countryCode
    };

    this.address = undefined;
    next();
});

// Bootcamp delete 
BootcampSchema.pre('remove', async function(next){
    console.log(`All courses deleted of ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp : this._id});
    next();
});

// Define a virual 
BootcampSchema.virtual('courses', {
    ref : 'Course',
    localField : '_id',
    foreignField : 'bootcamp',
    justOne : false
});

// Exported value 
module.exports = mongoose.model('Bootcamp', BootcampSchema);