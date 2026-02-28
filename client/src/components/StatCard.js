import React from 'react';
import clsx from 'clsx';

const colorClasses = {
  green: 'text-green-600 bg-green-100',
  red: 'text-red-600 bg-red-100',
  blue: 'text-blue-600 bg-blue-100',
  purple: 'text-purple-600 bg-purple-100',
  yellow: 'text-yellow-600 bg-yellow-100',
};

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-1">
              <span className={clsx(
                trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              )}>
                {trend}
              </span> from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
