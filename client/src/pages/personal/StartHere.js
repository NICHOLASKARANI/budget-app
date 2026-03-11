import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function StartHere() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user?.username}!</h1>
      <p className="text-gray-600 mb-6">Let's get you started with your premium budget tracker.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Step 1: Set Currency</h2>
          <p className="text-gray-500 mb-4">Choose your preferred currency</p>
          <Link to="/settings" className="text-indigo-600 hover:text-indigo-800">Go to Settings →</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Step 2: Add Income</h2>
          <p className="text-gray-500 mb-4">Track your income sources</p>
          <Link to="/personal/income" className="text-indigo-600 hover:text-indigo-800">Add Income →</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Step 3: Track Expenses</h2>
          <p className="text-gray-500 mb-4">Monitor your spending</p>
          <Link to="/personal/expenses" className="text-indigo-600 hover:text-indigo-800">Add Expenses →</Link>
        </div>
      </div>
    </div>
  );
}
