const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  membershipType: {
    type: String,
    enum: ["silver", "gold"],
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  notes: {
    firstName: String,
    lastName: String,
    emailId: String,
    membershipType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentDate: Date,
});

module.exports = mongoose.model("Payment", paymentSchema);
