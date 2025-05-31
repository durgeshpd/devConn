const express = require("express");
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender")
        .populate("toUserId", "firstName lastName photoUrl age gender");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        console.log("Fetching connections for:", loggedInUser._id);

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
        .populate("fromUserId", "firstName lastName photoUrl age gender")
        .populate("toUserId", "firstName lastName photoUrl age gender");

        console.log("Connection requests found:", connectionRequests.length);

        const data = connectionRequests.map((row) => {
            if (!row.fromUserId || !row.toUserId) {
                console.error("Missing populated user:", row);
                return null;
            }

            const isMeSender = row.fromUserId._id.toString() === loggedInUser._id.toString();
            return isMeSender ? row.toUserId : row.fromUserId;
        }).filter(Boolean);

        res.json({ data });
    } catch (err) {
        console.error("Error in /user/connections:", err);
        res.status(400).send({ message: err.message });
    }
});


userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users = await User.find({
            $and: [
               { _id: { $nin: Array.from(hideUsersFromFeed) }},
               { _id: { $ne: loggedInUser._id}},
            ],
        });

        res.send(users);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = userRouter;