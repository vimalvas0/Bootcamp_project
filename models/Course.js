const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const CourseScema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : [true, 'Please add a course title']
    },
    description : {
        type : String,
        required : [true, 'Please add a description']
    },
    weeks : {
        type : Number,
        required : [true, 'Please add number of weeks']
    },
    tuition : {
        type: Number,
        required : [true, 'Please add a description']
    },
    minimumSkill : {
        type : String,
        required : [true, 'Please add a minimum skill'],
        enum : ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable : {
        type : Boolean,
        default : false
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



CourseScema.statics.getAverageCost = async function(bootcampId){

    const obj = await this.aggregate([
        {
            $match : {bootcamp : bootcampId}
        },
        {
            $group : {
                _id : '$bootcamp',
                averageCost : { $avg : '$tuition'}
            }
        }
    ]);


    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost : Math.ceil(obj[0].averageCost * 10) / 10
        })
    }
    catch(err)
    {
        console.error(err);
    }

};


// calculate averageCost post saving a course
CourseScema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
});


// calculate averageCost before remove
CourseScema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseScema); 