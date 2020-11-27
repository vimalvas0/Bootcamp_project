const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const connectDb = require('./config/db');

const app = express();

connectDb();


//Setting up dotenv
dotenv.config({path: './config/config.env'});

const PORT = process.env.PORT || 5000;

app.use('/api/bootcamps', bootcamps);


process.on('unhandledRejection', (err, promise)=>{
	console.log('Unhandled Error : ' , err.message);

	//close the server
	server.close(()=>process.exit(1));
});


app.listen(PORT, ()=>{
	console.log(`Server is running in ${process.env.NODE_ENV} on port ${5000}`);
});