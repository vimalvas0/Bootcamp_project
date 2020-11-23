const express = require('express');
const dotenv = require('dotenv');

const app = express();


//Setting up dotenv
dotenv.config({path: './config/config.env'});


const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
	console.log(`Server is running in ${process.env.NODE_ENV} on port ${5000}`);
});