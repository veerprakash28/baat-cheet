const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

const sendMessage = async (req, res) => {
    const { content, chatId, messageType } = req.body;

    if (!chatId || (!content && messageType !== 'image')) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chatId: chatId,
        messageType: messageType || 'text',
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "username profilePic");
        message = await message.populate("chatId");
        message = await User.populate(message, {
            path: "chatId.members",
            select: "username profilePic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate("sender", "username profilePic email")
            .populate("chatId");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { sendMessage, allMessages };
