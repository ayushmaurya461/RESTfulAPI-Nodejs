const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')


const User = require('../models/user'); 
const { user_signup, user_login, delete_user } = require('../controllers/user');

router.post('/signup', user_signup);

router.post('/login', user_login);

router.delete('/:userID', checkAuth, delete_user);

module.exports = router;