
//  										== DEPENDENCIES ==
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: './config/config.env'});
const bootcamps = require('./routes/bootcamps');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Error handling middleware
const errorHandler = require('./middlewares/error');

//Getting the to config/db... setting up db
const connectDb = require('./config/db');

// To print the log messages with different colors.
const colors = require('colors');



//										== SETTING UP APP, DB, ETC ==


// App is holds the express function... Then App can be used for routing and other purposes.
const app = express();


//Execute the function that do two things : 
//1. Grab the connectDb (async function) from the config/db
//2. Execute the function connectDb in it which do further two things:
		//1. Connect to the db and store it in "conn"
		//2. Print the message on the console that it's connected to some host url
connectDb();


// Setting up environ. variables using "config/config.env" file


// PORT is either mentioned in the env file otherwise take 5000
const PORT = process.env.PORT || 5000;



//												== ROUTING ==	

// express.json() is built-in middleware that parses the incoming requests into the JSON objects
app.use(express.json());


app.use(cookieParser());


// Here, fileupload to upload a image
app.use(fileupload());

// Set up the static foler
app.use(express.static(path.join(__dirname, 'public')));

// We are giving the router (a express.Router()) present in the bootcamps "routes/bootcamps.js"
app.use('/api/bootcamps', bootcamps);
app.use('/api/courses', courses);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/reviews', reviews); 
app.use(errorHandler);


//											  == ENDING THINGS ==

// "server store" the app.listen()
const server = app.listen(PORT, ()=>{
	console.log(`Server is running in ${process.env.NODE_ENV} on port ${5000}`.yellow.bold);
});


// This handles the errors with the promises if that promise is not handling the eroor.
// This is achieved through the event loop, and hence handles all the rejected promises.
process.on('unhandledRejection', (err, promise)=>{
	console.log('Unhandled Error At : ', promise  + ". " + "Error : " + err.message);
	

	//close the server if there is an error.
	server.close(()=>process.exit(1));
});


