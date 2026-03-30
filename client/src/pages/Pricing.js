import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

const pricingPlans = [
  {
    name: 'Monthly',
    period: 'month',
    originalPrice: 17.99,
    discountedPrice: 12.60,
    discount: 30,
    priceId: 'price_monthly',
    description: 'Perfect for getting started'
  },
  {
    name: '3 Months',
    period: '3 months',
    originalPrice: 55.19,
    discountedPrice: 41.39,
    discount: 25,
    priceId: 'price_quarterly',
    description: 'Best for short-term commitment'
  },
  {
    name: 'Annual',
    period: 'year',
    originalPrice: 164.99,
    discountedPrice: 115.49,
    discount: 30,
    priceId: 'price_annual',
    description: 'Most popular - save 30%',
    popular: true
  },
  {
    name: 'Lifetime',
    period: 'lifetime',
    originalPrice: 779.99,
    discountedPrice: 623.99,
    discount: 20,
    priceId: 'price_lifetime',
    description: 'One-time payment, unlimited access'
  }
];

const paymentMethods = [
  { name: 'Visa', icon: '💳', type: 'card' },
  { name: 'Mastercard', icon: '💳', type: 'card' },
  { name: 'Amex', icon: '💳', type: 'card' },
  { name: 'Discover', icon: '💳', type: 'card' },
  { name: 'PayPal', icon: '🅿️', type: 'paypal' },
  { name: 'M-Pesa', icon: '📱', type: 'mpesa' },
  { name: 'Afrigo', icon: '🌍', type: 'afrigo' },
  { name: 'Verve', icon: '💳', type: 'card' }
];

function CheckoutForm({ plan, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.discountedPrice * 100, currency: 'usd', paymentMethod: selectedMethod })
      });
      const { clientSecret } = await response.json();
      
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      
      if (confirmError) {
        setError(confirmError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <div className="grid grid-cols-4 gap-2">
          {paymentMethods.map(method => (
            <button
              key={method.name}
              type="button"
              onClick={() => setSelectedMethod(method.type)}
              className={'p-2 border rounded-lg text-center ' + (selectedMethod === method.type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200')}
            >
              <div className="text-2xl">{method.icon}</div>
              <div className="text-xs">{method.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      {selectedMethod === 'card' && (
        <div className="border rounded-lg p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay ' + plan.discountedPrice + ' USD'}
      </button>
    </form>
  );
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [trialActive, setTrialActive] = useState(false);

  const handleFreeTrial = () => {
    localStorage.setItem('trial_started', new Date().toISOString());
    setTrialActive(true);
    window.location.href = '/register';
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful! Welcome to Premium!');
    window.location.href = '/personal/start-here';
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Start with a 7-day free trial, no credit card required</p>
          <button
            onClick={handleFreeTrial}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            🎁 Start 7-Day Free Trial
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={'bg-white rounded-2xl shadow-xl overflow-hidden ' + (plan.popular ? 'ring-2 ring-indigo-600 transform scale-105' : '')}>
              {plan.popular && <div className="bg-indigo-600 text-white text-center py-1 text-sm">Most Popular</div>}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold"></span>
                  <span className="text-gray-500"> / {plan.period}</span>
                </div>
                <div className="mt-2">
                  <span className="line-through text-gray-400"></span>
                  <span className="ml-2 text-green-600 font-semibold">Save {plan.discount}%</span>
                </div>
                <button
                  onClick={() => { setSelectedPlan(plan); setShowPayment(true); }}
                  className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">All Plans Include:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Income & Expense Tracking</div>
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Budget Planning</div>
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Net Worth Tracker</div>
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Savings Goals</div>
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Subscription Manager</div>
            <div className="flex items-start"><CheckIcon className="h-5 w-5 text-green-500 mr-2" /> Export to PDF/Excel/CSV</div>
          </div>
        </div>

        {showPayment && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
              <p className="mb-4">Plan: <strong>{selectedPlan.name}</strong> -  USD</p>
              <Elements stripe={stripePromise}>
                <CheckoutForm plan={selectedPlan} onSuccess={handlePaymentSuccess} />
              </Elements>
              <button onClick={() => setShowPayment(false)} className="mt-4 w-full py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
