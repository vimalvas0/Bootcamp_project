const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const ReviewScema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : [true, 'Please add a course title'],
        maxLength : 100
    },
    text : {
        type : String,
        required : [true, 'Please add a text']
    },
    rating : {
        type : Number,
        min : 1,
        max : 10,
        required : [true, 'Please add a rating']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required : true     
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true     
    }
});


//Prevent User to add one only  more than one bootcamp
ReviewScema.index({bootcamp :1, user : 1}, {unique : true});


// Get average rating for the bootcamp through reviews
ReviewScema.statics.getAverageRating = async function(bootcampId){

    const obj = await this.aggregate([
        {
            $match : {bootcamp : bootcampId}
        },
        {
            $group : {
                _id : '$bootcamp',
                averageRating : { $avg : '$rating'}
            }
        }
    ]);


    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating : obj[0].averageRating
        })
    }
    catch(err)
    {
        console.error(err);
    }

};

// calculate averageRating post saving a review
ReviewScema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp);
});


// calculate averageRating removing a review
ReviewScema.pre('remove', function(){
    this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model('Review', ReviewScema);
