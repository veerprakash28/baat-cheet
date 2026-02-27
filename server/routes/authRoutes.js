const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', apiLimiter, registerUser);
router.post('/login', apiLimiter, authUser);

module.exports = router;
