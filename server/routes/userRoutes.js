const express = require('express');
const { getProfile, searchUsers, addFriend, getFriends } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/search', protect, searchUsers);
router.post('/add-friend', protect, addFriend);
router.get('/friends', protect, getFriends);

module.exports = router;
