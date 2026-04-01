import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const pricingPlans = [
  {
    name: 'Monthly',
    period: 'month',
    originalPrice: 17.99,
    discountedPrice: 12.60,
    discount: 30,
    description: 'Perfect for getting started'
  },
  {
    name: '3 Months',
    period: '3 months',
    originalPrice: 55.19,
    discountedPrice: 41.39,
    discount: 25,
    description: 'Best for short-term commitment'
  },
  {
    name: 'Annual',
    period: 'year',
    originalPrice: 164.99,
    discountedPrice: 115.49,
    discount: 30,
    description: 'Most popular - save 30%',
    popular: true
  },
  {
    name: 'Lifetime',
    period: 'lifetime',
    originalPrice: 779.99,
    discountedPrice: 623.99,
    discount: 20,
    description: 'One-time payment, unlimited access'
  }
];

const paymentMethods = [
  { name: 'Visa', icon: '💳', type: 'card', cardNumber: '4478 1500 0287 8906', cvv: '685', expiry: '03/31' },
  { name: 'Mastercard', icon: '💳', type: 'card' },
  { name: 'Amex', icon: '💳', type: 'card' },
  { name: 'Discover', icon: '💳', type: 'card' },
  { name: 'PayPal', icon: '🅿️', type: 'paypal' },
  { name: 'M-Pesa', icon: '📱', type: 'mpesa', phone: '0721 669850' },
  { name: 'Afrigo', icon: '🌍', type: 'afrigo' },
  { name: 'Verve', icon: '💳', type: 'card' }
];

export default function Pricing() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please login first to subscribe');
      window.location.href = '/login';
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setProcessing(true);
    
    try {
      const paymentData = {
        user_id: user.id,
        plan: selectedPlan.name,
        amount: selectedPlan.discountedPrice,
        payment_method: paymentMethod,
        transaction_id: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
        status: 'completed'
      };
      
      await api.post('/admin/payments', paymentData);
      
      toast.success('Payment successful! You now have access to ' + selectedPlan.name + ' plan.');
      setShowPayment(false);
      window.location.href = '/personal/start-here';
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Select the plan that works best for you</p>
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
                  onClick={() => handleSubscribe(plan)}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
              <p className="mb-2">Plan: <strong>{selectedPlan.name}</strong></p>
              <p className="mb-4">Amount: <strong className="text-green-600"> USD</strong></p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.name}
                      type="button"
                      onClick={() => setPaymentMethod(method.type)}
                      className={'p-2 border rounded-lg text-center ' + (paymentMethod === method.type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200')}
                    >
                      <div className="text-2xl">{method.icon}</div>
                      <div className="text-xs">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Test Card Number:</p>
                    <p className="font-mono text-sm">4478 1500 0287 8906</p>
                    <p className="text-xs text-gray-500 mt-1">CVV: 685 | Expiry: 03/31</p>
                  </div>
                  <input type="text" placeholder="Card Number" className="w-full p-2 border rounded-lg" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="p-2 border rounded-lg" />
                    <input type="text" placeholder="CVV" className="p-2 border rounded-lg" />
                  </div>
                </div>
              )}

              {paymentMethod === 'mpesa' && (
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">M-Pesa Paybill:</p>
                    <p className="font-mono text-lg font-bold">0721 669850</p>
                    <p className="text-xs text-gray-500 mt-1">Account: FinovaTrack</p>
                  </div>
                  <input type="text" placeholder="M-Pesa Phone Number" className="w-full p-2 border rounded-lg" />
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handlePaymentSubmit}
                  disabled={processing}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Pay $' + selectedPlan.discountedPrice}
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
