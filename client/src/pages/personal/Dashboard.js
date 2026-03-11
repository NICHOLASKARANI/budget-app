import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  TrendingUpIcon,
  ChartBarIcon,
  FlagIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { name: 'Add Income', icon: CurrencyDollarIcon, path: '/personal/income', color: 'bg-green-500' },
    { name: 'Add Expense', icon: CreditCardIcon, path: '/personal/expenses', color: 'bg-red-500' },
    { name: 'View Budget', icon: ChartBarIcon, path: '/personal/budget', color: 'bg-indigo-500' },
    { name: 'Check Goals', icon: FlagIcon, path: '/personal/goals', color: 'bg-purple-500' },
  ];

  const stats = [
    { name: 'Monthly Income', value: '', change: '+0%', changeType: 'increase' },
    { name: 'Monthly Expenses', value: '', change: '0%', changeType: 'neutral' },
    { name: 'Savings Rate', value: '0%', change: '0%', changeType: 'neutral' },
    { name: 'Active Goals', value: '0', change: '0', changeType: 'neutral' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Here's an overview of your financial health
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className={	ext-sm mt-2 }>
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                <div className={inline-flex p-3 rounded-xl  text-white mb-3}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.name}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Savings Goals</h3>
              <FlagIcon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold mb-2">0</p>
            <p className="text-indigo-100">Active goals</p>
            <button 
              onClick={() => navigate('/personal/goals')}
              className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View Goals
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Subscriptions</h3>
              <ArrowPathIcon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold mb-2">0</p>
            <p className="text-green-100">Active subscriptions</p>
            <button 
              onClick={() => navigate('/personal/subscriptions')}
              className="mt-4 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Manage
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Net Worth</h3>
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold mb-2"></p>
            <p className="text-purple-100">Track your wealth</p>
            <button 
              onClick={() => navigate('/personal/networth')}
              className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              View Net Worth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
