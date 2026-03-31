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
  SparklesIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  TicketIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  {
    section: 'Getting Started',
    items: [
      { name: 'Start Here', to: '/personal/start-here', icon: BookOpenIcon }
    ]
  },
  {
    section: 'Personal Budget',
    items: [
      { name: 'Dashboard', to: '/personal/dashboard', icon: HomeIcon },
      { name: 'Monthly Dashboard', to: '/personal/monthly-dashboard', icon: CalendarIcon },
      { name: 'Income Tracker', to: '/personal/income', icon: CurrencyDollarIcon },
      { name: 'Expense Tracker', to: '/personal/expenses', icon: CreditCardIcon },
      { name: 'Budget Planner', to: '/personal/budget', icon: ChartBarIcon },
      { name: 'Savings Goals', to: '/personal/goals', icon: FlagIcon, premium: true },
      { name: 'Subscriptions', to: '/personal/subscriptions', icon: ArrowPathIcon, premium: true },
      { name: 'Net Worth', to: '/personal/networth', icon: ArrowTrendingUpIcon, premium: true },
      { name: 'Annual Reports', to: '/personal/reports', icon: DocumentTextIcon }
    ]
  },
  {
    section: 'Business Finance',
    items: [
      { name: 'Business Dashboard', to: '/business/dashboard', icon: BuildingOfficeIcon },
      { name: 'Revenue Tracker', to: '/business/revenue', icon: BanknotesIcon },
      { name: 'Cost Tracker', to: '/business/costs', icon: CreditCardIcon },
      { name: 'Profit Margins', to: '/business/profit-margin', icon: PresentationChartLineIcon },
      { name: 'Cash Flow', to: '/business/cash-flow', icon: ArrowPathIcon },
      { name: 'Budget Utilization', to: '/business/budget-utilization', icon: ChartBarIcon },
      { name: 'Forecast & Variance', to: '/business/forecast', icon: ArrowTrendingUpIcon },
      { name: 'Financial Reports', to: '/business/reports', icon: DocumentTextIcon }
    ]
  },
  {
    section: 'Customer Support',
    items: [
      { name: 'Support Dashboard', to: '/support/dashboard', icon: UserGroupIcon },
      { name: 'Ticket Volume', to: '/support/ticket-volume', icon: TicketIcon },
      { name: 'Response Time', to: '/support/response-time', icon: ClockIcon },
      { name: 'Resolution Time', to: '/support/resolution-time', icon: ClockIcon },
      { name: 'Customer Satisfaction', to: '/support/customer-satisfaction', icon: SparklesIcon },
      { name: 'Common Issues', to: '/support/common-issues', icon: DocumentTextIcon },
      { name: 'Team Performance', to: '/support/team-performance', icon: UserGroupIcon },
      { name: 'Support Reports', to: '/support/reports', icon: DocumentTextIcon }
    ]
  },
  {
    section: 'Settings',
    items: [
      { name: 'Settings', to: '/settings', icon: Cog6ToothIcon }
    ]
  }
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    navigation.map(s => s.section).reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
        'fixed lg:static inset-y-0 left-0 transform bg-gradient-to-b from-gray-900 to-gray-800 text-white w-80 transition-transform duration-300 ease-in-out z-40 overflow-y-auto',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">F</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">FinovaTrack</h1>
              <p className="text-xs text-gray-400">Smart Financial Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            {navigation.map((section) => (
              <div key={section.section} className="mb-6">
                <button
                  onClick={() => toggleSection(section.section)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-gray-800"
                >
                  <span>{section.section}</span>
                  <svg
                    className={h-4 w-4 transform transition-transform }
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections[section.section] && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          clsx(
                            'group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200',
                            isActive 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className={clsx(
                              'h-5 w-5 mr-3 flex-shrink-0',
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            )} />
                            <span className="flex-1">{item.name}</span>
                            {item.premium && (
                              <SparklesIcon className="h-4 w-4 text-yellow-500" />
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Brand Badge */}
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl">
              <p className="text-xs text-indigo-200">FinovaTrack</p>
              <p className="text-sm font-bold text-white">Smart Financial Management</p>
              <div className="flex items-center mt-2 text-indigo-200 text-xs">
                <SparklesIcon className="h-3 w-3 mr-1" />
                Personal · Business · Support
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
