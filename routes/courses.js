const express = require('express');


//Fetch the set of fuctions from the file "/controllers/bootcamps"
const {
  getCourses,
  getCoursesById,
  createCourse,
  updateCourse,
  deleteCourse
  } = require('../controllers/courses');


const advancedResults = require('../middlewares/advancedResults');
const Course = require('../models/Course');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router({mergeParams : true});


router.route('/')
.get(advancedResults(Course, {
  path : 'bootcamp',
  select : 'name description'
}), getCourses)
.post(protect, createCourse);

router.route('/:id')
.get(getCoursesById)
.post(protect, updateCourse)
.delete(protect, deleteCourse);

module.exports = router;
