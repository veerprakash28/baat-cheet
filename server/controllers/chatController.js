const Chat = require('../models/Chat');
const User = require('../models/User');

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroup: false,
        $and: [
            { members: { $elemMatch: { $eq: req.user._id } } },
            { members: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("members", "-password")
        .populate("lastMessage");

    isChat = await User.populate(isChat, {
        path: "lastMessage.sender",
        select: "username profilePic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroup: false,
            members: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "members",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
};

const fetchChats = async (req, res) => {
    try {
        Chat.find({ members: { $elemMatch: { $eq: req.user._id } } })
            .populate("members", "-password")
            .populate("admin", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "lastMessage.sender",
                    select: "username profilePic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.members || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var members = JSON.parse(req.body.members);

    if (members.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    members.push(req.user);

    try {
        const groupChat = await Chat.create({
            groupName: req.body.name,
            members: members,
            isGroup: true,
            admin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("members", "-password")
            .populate("admin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const renameGroup = async (req, res) => {
    const { chatId, groupName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            groupName: groupName,
        },
        {
            new: true,
        }
    )
        .populate("members", "-password")
        .populate("admin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
};

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { members: userId },
        },
        {
            new: true,
        }
    )
        .populate("members", "-password")
        .populate("admin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { members: userId },
        },
        {
            new: true,
        }
    )
        .populate("members", "-password")
        .populate("admin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
};

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};
