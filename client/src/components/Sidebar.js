import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ChartBarIcon,
  TargetIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  FileTextIcon,
  SettingsIcon
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Income', to: '/income', icon: CurrencyDollarIcon },
  { name: 'Expenses', to: '/expenses', icon: CreditCardIcon },
  { name: 'Budget', to: '/budget', icon: ChartBarIcon },
  { name: 'Goals', to: '/goals', icon: TargetIcon },
  { name: 'Subscriptions', to: '/subscriptions', icon: RefreshCwIcon },
  { name: 'Net Worth', to: '/networth', icon: TrendingUpIcon },
  { name: 'Reports', to: '/reports', icon: FileTextIcon },
  { name: 'Settings', to: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-indigo-600">Budget Tracker</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={clsx(
                          'mr-3 flex-shrink-0 h-5 w-5',
                          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
