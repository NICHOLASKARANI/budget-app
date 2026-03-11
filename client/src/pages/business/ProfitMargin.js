import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfitMargin() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profit Margins</h1>
        <p className="mt-2 text-sm text-gray-600">
          Analyze profitability across products and services
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Gross Profit Margin</h3>
          <p className="text-3xl font-bold text-green-600">42.5%</p>
          <p className="text-sm text-gray-500 mt-2">+2.3% from last quarter</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Operating Margin</h3>
          <p className="text-3xl font-bold text-blue-600">28.3%</p>
          <p className="text-sm text-gray-500 mt-2">+1.8% from last quarter</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Net Profit Margin</h3>
          <p className="text-3xl font-bold text-purple-600">18.7%</p>
          <p className="text-sm text-gray-500 mt-2">+1.2% from last quarter</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Margins by Product Line</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Product A</td>
              <td>{user?.currency}125,000</td>
              <td>{user?.currency}68,750</td>
              <td>{user?.currency}56,250</td>
              <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded">45%</span></td>
            </tr>
            <tr>
              <td className="py-3">Product B</td>
              <td>{user?.currency}98,000</td>
              <td>{user?.currency}58,800</td>
              <td>{user?.currency}39,200</td>
              <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded">40%</span></td>
            </tr>
            <tr>
              <td className="py-3">Product C</td>
              <td>{user?.currency}75,000</td>
              <td>{user?.currency}48,750</td>
              <td>{user?.currency}26,250</td>
              <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">35%</span></td>
            </tr>
            <tr>
              <td className="py-3">Service D</td>
              <td>{user?.currency}52,000</td>
              <td>{user?.currency}26,000</td>
              <td>{user?.currency}26,000</td>
              <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded">50%</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Margin Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Gross Margin</span>
                <span>42.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '42.5%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Operating Margin</span>
                <span>28.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '28.3%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Net Margin</span>
                <span>18.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '18.7%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Industry Comparison</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Your Gross Margin</span>
              <span className="font-medium">42.5%</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Industry Average</span>
              <span>38.2%</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Above Average</span>
              <span>+4.3%</span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span>Your Net Margin</span>
                <span className="font-medium">18.7%</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Industry Average</span>
                <span>15.5%</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Above Average</span>
                <span>+3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
