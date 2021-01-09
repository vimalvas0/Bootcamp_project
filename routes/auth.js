const express = require('express');
const { register, login, getMe, forgotPassword, resetToken, updateDetails, updatePassword } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');



router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', protect, forgotPassword);
router.post('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.put('/resetPassword/:resetToken', resetToken );

// Get my profile but get all about authentication stuff before
router.get('/me', protect, getMe);

module.exports = router;