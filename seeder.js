const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');


//Setup environment variable
dotenv.config({path : './config/config.env'});

//Connect to the database
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology: true,
});

//Load the database
const Bootcamp = require('./models/Bootcamp');
const Courses = require('./models/Course');
const User = require('./models/User');

//Read the json file and convert into string
const bootcamp = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);


//Read the json file and convert into string
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//Read the json file and convert into string
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)


//Import all the data into database
const importData = async ()=>{
    try{
        await Bootcamp.create(bootcamp);
        await Courses.create(courses);
        await User.create(users);

        console.log(`Data Imported...`.green.inverse);
    }
    catch(err)
    {
        console.error(err);
    }
}


//Delete all the data from database
const deleteData = async ()=>{
    try{
        await Bootcamp.deleteMany();
        await Courses.deleteMany();
        await User.deleteMany();

        console.log(`Data Erased...`.red.inverse);
    }
    catch(err)
    {
        console.error(err);
    }
}

//Taking the values from the command line
if(process.argv[2] === '-i')
{
    importData();
}else if(process.argv[2] === '-d')
{
    deleteData();
}
