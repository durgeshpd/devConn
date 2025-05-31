const express = require('express');
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl",
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = chatRouter;
