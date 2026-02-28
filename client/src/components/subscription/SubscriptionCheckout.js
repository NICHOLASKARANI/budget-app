import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { stripePromise, createCheckoutSession } from '../../utils/stripe';

export default function SubscriptionCheckout({ priceId, planName }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      const sessionId = await createCheckoutSession(
        priceId,
        window.location.origin + '/app/dashboard',
        window.location.origin + '/pricing'
      );
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Button text without template literals
  const getButtonText = () => {
    if (loading) {
      return 'Processing...';
    }
    return 'Subscribe to ' + planName;
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {getButtonText()}
    </button>
  );
}
