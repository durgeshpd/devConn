import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const plans = [
  {
    name: 'Silver Membership',
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

            <button className={`btn w-full ${plan.buttonStyle}`}>
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
