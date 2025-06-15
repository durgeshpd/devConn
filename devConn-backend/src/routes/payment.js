const express = require('express');
const paymentRouter = express.Router();
const crypto = require('crypto');
const Payment = require('../models/payment');
const User = require('../models/user');
const razorpay = require('../utils/razorpay');
const { membershipAmount } = require('../utils/constants');
const { userAuth } = require('../middlewares/auth');

paymentRouter.post('/webhook', async (req, res) => {
  console.log('🚀 Webhook received');
  console.log('Headers:', req.headers);

  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    if (!webhookSignature) {
      console.warn('⚠️ Missing X-Razorpay-Signature header');
      return res.status(400).send('Missing signature');
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const bodyBuffer = req.body;
    const expectedSignature = crypto.createHmac('sha256', secret).update(bodyBuffer).digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.warn('⚠️ Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const payload = JSON.parse(bodyBuffer.toString('utf8'));
    console.log('Payload:', JSON.stringify(payload).slice(0, 500));

    const paymentDetails = payload.payload.payment.entity;

    const payment = await Payment.findOne({ razorpayOrderId: paymentDetails.order_id });
    if (!payment) {
      console.warn('⚠️ Payment record not found for order:', paymentDetails.order_id);
      return res.status(404).send('Payment record not found');
    }

    payment.status = paymentDetails.status;
    payment.razorpayPaymentId = paymentDetails.id;
    payment.paymentDate = new Date(paymentDetails.created_at * 1000);
    await payment.save();

    const user = await User.findById(payment.userId);
    if (user) {
      user.isPremium = true;
      user.membershipType = payment.membershipType;
      await user.save();
    }

    return res.status(200).send('Webhook processed successfully');
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).send('Server error');
  }
});

paymentRouter.post('/create-order', userAuth, async (req, res) => {
  try {
    const { membershipType = 'silver' } = req.body || {};
    const baseAmount = membershipAmount[membershipType];

    if (!baseAmount) {
      return res.status(400).json({ success: false, message: 'Invalid membership type' });
    }

    const amount = baseAmount * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName: req.user.firstName || 'N/A',
        lastName: req.user.lastName || 'N/A',
        emailId: req.user.email || '',
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      membershipType,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      notes: order.notes,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = paymentRouter;
