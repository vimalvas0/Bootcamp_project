const express = require('express');

const { protect, authorize } = require('../middlewares/auth');


//Fetch the set of fuctions from the file "/controllers/bootcamps"
const {
    getUsers,
    getUserById,
    createUser,
    updateById,
    deleteUser
} = require('../controllers/users');

const advancedResults = require('../middlewares/advancedResults');
const router = express.Router({mergeParams : true});

const User = require('../models/User');


router.use(protect);
router.use(authorize);

router.
    route('/').get(advancedResults(User), getUsers)
    .post(createUser)

router
    .route(':/id')
    .get(getUserById)
    .put(updateById)
    .delete(deleteUser);


module.exports = router;