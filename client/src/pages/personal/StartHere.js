import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  CreditCardIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function StartHere() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    {
      number: 1,
      title: 'Set Your Currency',
      description: 'Choose your preferred currency and fiscal year settings',
      icon: CurrencyDollarIcon,
      action: () => navigate('/settings'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      number: 2,
      title: 'Add Income Sources',
      description: 'Track your salary, freelance, investments, and more',
      icon: ArrowTrendingUpIcon,
      action: () => navigate('/personal/income'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      number: 3,
      title: 'Record Expenses',
      description: 'Categorize and monitor your spending habits',
      icon: CreditCardIcon,
      action: () => navigate('/personal/expenses'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const features = [
    {
      name: '10 Premium Sheets',
      description: 'Complete budget management with all spreadsheet features',
      icon: SparklesIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Interactive Charts',
      description: 'Visualize your finances with beautiful graphs',
      icon: ChartBarIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Multi-Currency',
      description: 'Support for USD, EUR, GBP, CAD, AUD',
      icon: CurrencyDollarIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-6">
            <span className="px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
              Welcome {user?.username || 'User'}! 👋
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-4">
            Let's Get You
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Started
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Complete these 3 simple steps to set up your premium budget tracker
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                  
                }>
                  {step}
                </div>
                {step < 3 && (
                  <div className="w-16 h-1 mx-2 bg-gray-200 rounded">
                    <div className="h-full bg-indigo-600 rounded" style={{ width: step === 1 ? '0%' : '50%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={step.action}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-xl z-10">
                {step.number}
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden pt-8">
                <div className={p-8 }>
                  <div className="flex justify-center mb-6">
                    <div className={p-4 rounded-2xl bg-gradient-to-r  shadow-lg}>
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {step.description}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        step.action();
                      }}
                      className={
                        inline-flex items-center px-6 py-3 rounded-xl font-medium
                        transition-all duration-200 transform group-hover:scale-105
                        bg-gradient-to-r  text-white shadow-lg
                        hover:shadow-xl
                      }
                    >
                      Get Started
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="group p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-200 transform hover:scale-105"
            >
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600 mb-3 group-hover:rotate-12 transition-transform" />
              <h3 className="font-semibold text-gray-900">Set Currency</h3>
              <p className="text-sm text-gray-600 mt-1">Step 1: Choose currency</p>
            </button>

            <button
              onClick={() => navigate('/personal/income')}
              className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 transform hover:scale-105"
            >
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mb-3 group-hover:rotate-12 transition-transform" />
              <h3 className="font-semibold text-gray-900">Add Income</h3>
              <p className="text-sm text-gray-600 mt-1">Step 2: Track earnings</p>
            </button>

            <button
              onClick={() => navigate('/personal/expenses')}
              className="group p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-200 transform hover:scale-105"
            >
              <CreditCardIcon className="h-8 w-8 text-purple-600 mb-3 group-hover:rotate-12 transition-transform" />
              <h3 className="font-semibold text-gray-900">Record Expenses</h3>
              <p className="text-sm text-gray-600 mt-1">Step 3: Monitor spending</p>
            </button>

            <button
              onClick={() => navigate('/personal/dashboard')}
              className="group p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-all duration-200 transform hover:scale-105"
            >
              <SparklesIcon className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
              <h3 className="font-semibold text-gray-900">View Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">See your progress</p>
            </button>
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={inline-flex p-3 rounded-xl  mb-4}>
                <feature.icon className={h-6 w-6 } />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need help? Check out our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              documentation
            </a>{' '}
            or{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Missing ChartBarIcon import
import { ChartBarIcon } from '@heroicons/react/24/outline';
