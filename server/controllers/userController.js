const User = require('../models/User');

const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

const searchUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { username: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
    res.send(users);
};

const addFriend = async (req, res) => {
    const { friendId } = req.body;

    if (!friendId) {
        res.status(400);
        throw new Error('Friend ID is required');
    }

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
        res.status(404);
        throw new Error('Friend not found');
    }

    if (user.friends.includes(friendId)) {
        res.status(400);
        throw new Error('Already friends');
    }

    user.friends.push(friendId);
    friend.friends.push(req.user._id);

    await user.save();
    await friend.save();

    res.json({ success: true, message: 'Friend added successfully' });
};

const getFriends = async (req, res) => {
    const user = await User.findById(req.user._id).populate('friends', '-password');
    res.json({ success: true, friends: user.friends });
};

module.exports = { getProfile, searchUsers, addFriend, getFriends };
