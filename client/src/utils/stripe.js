import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
export const stripePromise = loadStripe('pk_test_your_publishable_key');

// Plan IDs from Stripe Dashboard
export const PRICE_IDS = {
  monthly: 'price_monthly_id',
  annual: 'price_annual_id',
  lifetime: 'price_lifetime_id'
};

export const createCheckoutSession = async (priceId, successUrl, cancelUrl) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl
      }),
    });
    
    const session = await response.json();
    return session.id;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
