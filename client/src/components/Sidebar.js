import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ChartBarIcon,
  FlagIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CalendarIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  { 
    name: 'Start Here', 
    to: '/start-here', 
    icon: BookOpenIcon,
    description: 'Quick setup guide'
  },
  { 
    name: 'Dashboard', 
    to: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview & insights'
  },
  { 
    name: 'Monthly Dashboard', 
    to: '/monthly-dashboard', 
    icon: CalendarIcon,
    description: 'Month by month view'
  },
  { 
    name: 'Income Tracker', 
    to: '/income', 
    icon: CurrencyDollarIcon,
    description: 'Track your earnings'
  },
  { 
    name: 'Expense Tracker', 
    to: '/expenses', 
    icon: CreditCardIcon,
    description: 'Monitor spending'
  },
  { 
    name: 'Budget Planner', 
    to: '/budget', 
    icon: ChartBarIcon,
    description: 'Plan your budget'
  },
  { 
    name: 'Savings Goals', 
    to: '/goals', 
    icon: FlagIcon,
    description: 'Track your progress',
    premium: true
  },
  { 
    name: 'Subscriptions', 
    to: '/subscriptions', 
    icon: ArrowPathIcon,
    description: 'Manage recurring payments',
    premium: true
  },
  { 
    name: 'Net Worth', 
    to: '/networth', 
    icon: ArrowTrendingUpIcon,
    description: 'Assets & liabilities',
    premium: true
  },
  { 
    name: 'Annual Summary', 
    to: '/reports', 
    icon: DocumentTextIcon,
    description: 'Year in review'
  },
  { 
    name: 'Settings', 
    to: '/settings', 
    icon: Cog6ToothIcon,
    description: 'Preferences & currency'
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={clsx(
        'fixed lg:static inset-y-0 left-0 transform bg-gradient-to-b from-gray-900 to-gray-800 text-white w-72 transition-transform duration-300 ease-in-out z-40',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">B$</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Budget Tracker</h1>
              <p className="text-xs text-gray-400">Premium Annual 2026</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'group relative flex items-center px-3 py-3 my-1 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={clsx(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    )} />
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.premium && (
                          <SparklesIcon className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Premium Badge */}
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl">
              <p className="text-xs text-yellow-100">Premium Annual</p>
              <p className="text-sm font-bold text-white">Budget Spreadsheet 2026</p>
              <div className="flex items-center mt-2 text-yellow-200 text-xs">
                <SparklesIcon className="h-3 w-3 mr-1" />
                All 10 sheets included
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
