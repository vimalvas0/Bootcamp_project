const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');

const app = express();


//Setting up dotenv
dotenv.config({path: './config/config.env'});

//Path to routes



const PORT = process.env.PORT || 5000;

app.use('/api/bootcamps', bootcamps);


app.listen(PORT, ()=>{
	console.log(`Server is running in ${process.env.NODE_ENV} on port ${5000}`);
});