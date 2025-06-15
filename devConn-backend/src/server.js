require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

const initializeSocket = require('./utils/socket');
initializeSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);


app.use((req,res,next) => {
  if (req.originalUrl === '/payment/webhook') {
    express.raw({ type: 'application/json' })(req,res,next);
  } else {
    express.json()(req,res,next);
  }
});

app.use(cookieParser());

app.use('/images',express.static('public/images'));

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const paymentRouter = require('./routes/payment');

app.use('/auth',authRouter);
app.use('/profile',profileRouter);
app.use('/requests',requestRouter);
app.use('/users',userRouter);
app.use('/chat',chatRouter);
app.use('/payment',paymentRouter);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT,() => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:',err.message);
    process.exit(1);
  });
