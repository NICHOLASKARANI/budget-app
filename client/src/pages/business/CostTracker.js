import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CostTracker() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cost Tracker</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor and categorize business expenses
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Cost Categories</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Salaries</span>
              <span className="font-medium">{user?.currency} 35,000</span>
            </div>
            <div className="flex justify-between">
              <span>Rent</span>
              <span className="font-medium">{user?.currency} 12,000</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing</span>
              <span className="font-medium">{user?.currency} 15,000</span>
            </div>
            <div className="flex justify-between">
              <span>Operations</span>
              <span className="font-medium">{user?.currency} 16,450</span>
            </div>
            <div className="flex justify-between pt-3 border-t font-bold">
              <span>Total</span>
              <span>{user?.currency} 78,450</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fixed Costs</span>
                <span>{user?.currency} 45,200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '57.6%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Variable Costs</span>
                <span>{user?.currency} 33,250</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{width: '42.4%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Cost Trend</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Fixed</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Variable</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">vs Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">January</td>
              <td>42,500</td>
              <td>28,500</td>
              <td>71,000</td>
              <td className="text-green-600">-2.5%</td>
            </tr>
            <tr>
              <td className="py-3">February</td>
              <td>43,200</td>
              <td>31,800</td>
              <td>75,000</td>
              <td className="text-green-600">-1.8%</td>
            </tr>
            <tr>
              <td className="py-3">March</td>
              <td>44,000</td>
              <td>32,500</td>
              <td>76,500</td>
              <td className="text-yellow-600">+0.5%</td>
            </tr>
            <tr>
              <td className="py-3">April</td>
              <td>44,800</td>
              <td>35,200</td>
              <td>80,000</td>
              <td className="text-red-600">+3.2%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
