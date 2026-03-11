import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Forecast & Variance() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Forecast & Variance</h1>
        <p className="mt-2 text-sm text-gray-600">
          Compare actual performance against forecasts
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Coming Soon</h2>
          <p className="text-gray-500">
            This page is under development. Full analytics and features will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
