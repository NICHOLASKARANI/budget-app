import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
  const features = [
    {
      name: '10 Premium Sheets',
      description: 'Complete budget management with all spreadsheet features',
      icon: SparklesIcon
    },
    {
      name: 'Interactive Charts',
      description: 'Visualize your finances with beautiful, interactive graphs',
      icon: ChartBarIcon
    },
    {
      name: 'Multi-Currency',
      description: 'Support for USD, EUR, GBP, CAD, AUD with live conversion',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties',
      icon: ShieldCheckIcon
    },
    {
      name: 'Net Worth Tracking',
      description: 'Track assets, liabilities, and watch your wealth grow',
      icon: ArrowTrendingUpIcon
    },
    {
      name: 'Subscription Manager',
      description: 'Never miss a payment with automated tracking',
      icon: CreditCardIcon
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Premium Annual Budget
            <span className="block text-indigo-200">Spreadsheet, Reimagined</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your finances with our complete budget management solution. 
            All 10 premium spreadsheet features, now as a powerful web app.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 md:py-4 md:text-lg md:px-10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to manage your money
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              All 10 premium spreadsheet features, now with real-time updates and beautiful visualizations
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to take control?</span>
            <span className="block text-indigo-200">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of users who've transformed their financial lives.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
