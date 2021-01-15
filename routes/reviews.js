const express = require('express');

const {
 getReviews,
 getReviewById,
 addReview,
 updateReview,
 deleteReview
} = require('../controllers/reviews');

const User = require('../models/User');
const Course = require('../models/Course');

const advancedResults = require('../middlewares/advancedResults');
const Review = require('../models/Review');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router({mergeParams : true});


router.route('/')
.get(advancedResults(Review, {
  path : 'bootcamp',
  select : 'name description'
}), getReviews)
.post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
.get(getReviewById)
.put(protect, authorize('user', 'admin'), updateReview)
.delete(protect, authorize('user', 'admin'), deleteReview);
// .post(protect, updateCourse)
// .delete(protect, deleteCourse);

module.exports = router;