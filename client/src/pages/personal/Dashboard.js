import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Personal Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome back, {user?.username}!</p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Your personal budget dashboard will appear here.</p>
      </div>
    </div>
  );
}
