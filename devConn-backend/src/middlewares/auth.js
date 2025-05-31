const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Authentication token is missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = {
    userAuth,
};
