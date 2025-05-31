const express = require('express');
const connectDB = require("./config/database");
const app = express()
const cookieParser = require("cookie-parser");
require('dotenv').config();
const cors = require("cors");
const http = require("http");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use('/images',express.static('public/images'));

const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        app.listen(process.env.PORT,() => {
            console.log(`✅ Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ DB Connection failed:",err.message);
        process.exit(1);
    });
