const colors = require('colors');
const ErrorResponse = require('../utils/ErrorResponse');


const errorHandler = (err, req, res, next)=>{

    //print the stack of error in blue

    console.log(err);
    //Get new error
    let error = {...err};
    error.message = err.message;

    // BAD ID Requested - This is when cannot a find a bootcamp by id provided
    if(err.name === 'CastError'){
        const message = `Cannot find a resource by value of ${err.value}`;
        error = new ErrorResponse(message, 400);
    }

    // Duplicate key
    if(err.code === 11000){
        const message = `There's a duplicate present in the data.`;
        error = new ErrorResponse(message, 400);
    }


    // Required fields not entered
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    console.log(err.stack.red);

    console.log(err.name);


    // Sending the json object instead of a dead html page
    res.status(error.statusCode || 500).json({
        "success" : false,
        "error" : error.message
    });
}

module.exports = errorHandler;