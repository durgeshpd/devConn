import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';

const plans = [
  {
    name: 'Silver Membership',
    type: 'silver',
    features: [
      'Send up to 50 connection requests daily',
      'Chat with matched users',
      'Priority support',
      'Valid for 3 months',
    ],
    buttonLabel: 'Buy Silver',
    buttonStyle: 'btn-secondary',
  },
  {
    name: 'Gold Membership',
    type: 'gold',
    features: [
      'Send up to 200 connection requests daily',
      'Unlimited chat access',
      'Profile boost & premium badge',
      'Valid for 6 months',
    ],
    buttonLabel: 'Buy Gold',
    buttonStyle: 'btn-primary',
  },
];

const Premium = () => {
  const user = useSelector((store) => store.user);

  const handleBuyClick = async (type) => {
    try {
      const res = await axios.post(
        BASE_URL + '/payment/create-order',
        { membershipType: type },
        { withCredentials: true }
      );

      console.log('Order created:', res.data);

      const { amount, keyId, currency, orderId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'DevConn',
        description: 'Connect to other developer',
        order_id: orderId,
        prefill: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email || '',
          contact: user.phone || '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-4xl font-bold text-center mb-10">Choose Your Membership</h2>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="card bg-base-300 rounded-box p-6 w-full max-w-sm shadow-md"
          >
            <h3 className="text-2xl font-semibold mb-6 text-center text-primary">
              {plan.name}
            </h3>

            <ul className="mb-6 space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuyClick(plan.type)}
              className={`btn w-full ${plan.buttonStyle}`}
            >
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
