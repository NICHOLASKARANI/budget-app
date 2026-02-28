import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState('monthly');

  const tiers = [
    {
      name: 'Monthly',
      price: { monthly: '.99', annual: '.99' },
      description: 'Perfect for getting started with premium budgeting',
      features: [
        'All 10 Premium Sheets',
        'Income & Expense Tracking',
        'Interactive Dashboards',
        'Multi-Currency Support',
        'Email Support',
        'Basic Reports'
      ],
      cta: 'Start Monthly Plan',
      mostPopular: false
    },
    {
      name: 'Annual',
      price: { monthly: '.99', annual: '.99' },
      description: 'Best value for serious budgeters',
      features: [
        'Everything in Monthly, plus:',
        'Net Worth Tracking',
        'Savings Goals with Progress',
        'Subscription Manager',
        'Advanced Analytics',
        'Priority Support',
        'Data Export (PDF/Excel)',
        'Email Notifications'
      ],
      cta: 'Get Annual Plan',
      mostPopular: true
    },
    {
      name: 'Lifetime',
      price: { monthly: '', annual: '' },
      description: 'One-time payment, lifetime access',
      features: [
        'All Annual Features',
        'Lifetime Updates',
        'Premium Support',
        'Early Access to New Features',
        'API Access',
        'Custom Reports',
        'Data Backup & Recovery'
      ],
      cta: 'Get Lifetime Access',
      mostPopular: false
    }
  ];

  const currentPrice = (tier) => {
    return billingInterval === 'monthly' ? tier.price.monthly : tier.price.annual;
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the plan that's right for your financial journey
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={${
                billingInterval === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-700'
              } relative w-24 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={${
                billingInterval === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-700'
              } relative w-24 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={elative bg-white border rounded-lg shadow-sm divide-y divide-gray-200 }
            >
              {tier.mostPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">{currentPrice(tier)}</span>
                  <span className="text-base font-medium text-gray-500">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                </p>
                
                <Link
                  to="/register"
                  className={mt-8 block w-full py-3 px-4 border border-transparent rounded-md text-center font-medium }
                >
                  {tier.cta}
                </Link>
              </div>
              
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-900">Can I switch plans later?</h4>
              <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Is there a free trial?</h4>
              <p className="mt-2 text-gray-600">Yes! All plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h4>
              <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe integration.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Can I export my data?</h4>
              <p className="mt-2 text-gray-600">Yes, all plans include data export to CSV, Excel, and PDF formats.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
