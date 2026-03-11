import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RevenueTracker() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Tracker</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and analyze your revenue streams
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{user?.currency} 76,800</p>
          <p className="text-sm text-green-600 mt-2">+12.5%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Quarterly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{user?.currency} 216,500</p>
          <p className="text-sm text-green-600 mt-2">+8.3%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{user?.currency} 845,000</p>
          <p className="text-sm text-green-600 mt-2">+15.2%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Customers</h3>
          <p className="text-2xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-green-600 mt-2">+45 new</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Revenue by Product</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Product A</span>
              <span className="font-medium">{user?.currency} 125,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '35%'}}></div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span>Product B</span>
              <span className="font-medium">{user?.currency} 98,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '27%'}}></div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span>Product C</span>
              <span className="font-medium">{user?.currency} 75,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '21%'}}></div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span>Services</span>
              <span className="font-medium">{user?.currency} 62,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '17%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Revenue by Region</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>North America</span>
              <span className="font-medium">{user?.currency} 185,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '52%'}}></div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span>Europe</span>
              <span className="font-medium">{user?.currency} 98,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '27%'}}></div>
            </div>
            
            <div className="flex justify-between mt-3">
              <span>Asia Pacific</span>
              <span className="font-medium">{user?.currency} 75,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '21%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Revenue Breakdown</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">New Customers</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg. Order Value</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">January</td>
              <td>{user?.currency}65,200</td>
              <td>98</td>
              <td>{user?.currency}665</td>
              <td className="text-green-600">+8.2%</td>
            </tr>
            <tr>
              <td className="py-3">February</td>
              <td>{user?.currency}68,500</td>
              <td>112</td>
              <td>{user?.currency}612</td>
              <td className="text-green-600">+5.1%</td>
            </tr>
            <tr>
              <td className="py-3">March</td>
              <td>{user?.currency}76,800</td>
              <td>145</td>
              <td>{user?.currency}530</td>
              <td className="text-green-600">+12.1%</td>
            </tr>
            <tr>
              <td className="py-3">April</td>
              <td>{user?.currency}78,500</td>
              <td>138</td>
              <td>{user?.currency}569</td>
              <td className="text-green-600">+2.2%</td>
            </tr>
            <tr>
              <td className="py-3">May</td>
              <td>{user?.currency}80,200</td>
              <td>142</td>
              <td>{user?.currency}565</td>
              <td className="text-green-600">+2.2%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
