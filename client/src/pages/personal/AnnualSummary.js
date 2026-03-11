import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AnnualSummary() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">AnnualSummary</h1>
      <p className="text-gray-600 mb-4">Welcome, {user?.username}!</p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">This page is under construction. Full features coming soon.</p>
      </div>
    </div>
  );
}
