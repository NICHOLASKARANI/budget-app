import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon, CurrencyDollarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: 2,
      title: 'Add Income Sources',
      description: 'Track your salary, freelance, investments, and more',
      icon: PlayIcon,
      action: () => navigate('/income'),
      color: 'from-green-500 to-green-600'
    },
    {
      number: 3,
      title: 'Record Expenses',
      description: 'Categorize and monitor your spending habits',
      icon: PlayIcon,
      action: () => navigate('/expenses'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Helper function to get step circle class
  const getStepCircleClass = (color) => {
    return 'flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ' + color + ' text-white font-bold text-lg shadow-lg transform transition-transform group-hover:scale-110';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Budget Tracker
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your premium annual budget spreadsheet transformed into a powerful web app
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Started in 3 Simple Steps</h2>
          
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start group">
                <div className={getStepCircleClass(step.color)}>
                  {step.number}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                  
                  <button
                    onClick={step.action}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to {step.title}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
