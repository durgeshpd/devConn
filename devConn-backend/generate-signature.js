const crypto = require('crypto');

const secret = 'DevC0nn$123';

const body = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_ABC123XYZ",
        entity: "payment",
        amount: 50000,
        currency: "INR",
        status: "captured",
        order_id: "order_9A33XWu170gUtm",
        created_at: 1612300000
      }
    }
  }
});

const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

console.log("X-Razorpay-Signature:", signature);
