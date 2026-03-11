import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ForecastVariance() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Forecast & Variance</h1>
        <p className="mt-2 text-sm text-gray-600">
          Compare actual performance against forecasts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Revenue Variance</h3>
          <p className="text-2xl font-bold text-green-600">+8.2%</p>
          <p className="text-sm text-gray-500 mt-2">Above forecast</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Expense Variance</h3>
          <p className="text-2xl font-bold text-green-600">-3.5%</p>
          <p className="text-sm text-gray-500 mt-2">Below forecast</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Profit Variance</h3>
          <p className="text-2xl font-bold text-green-600">+12.3%</p>
          <p className="text-sm text-gray-500 mt-2">Above forecast</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Cash Flow Variance</h3>
          <p className="text-2xl font-bold text-green-600">+5.7%</p>
          <p className="text-sm text-gray-500 mt-2">Above forecast</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Monthly Forecast vs Actual</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Forecast</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Variance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">January</td>
              <td>{user?.currency}65,000</td>
              <td>{user?.currency}68,200</td>
              <td className="text-green-600">+3,200</td>
              <td className="text-green-600">+4.9%</td>
            </tr>
            <tr>
              <td className="py-3">February</td>
              <td>{user?.currency}68,000</td>
              <td>{user?.currency}71,500</td>
              <td className="text-green-600">+3,500</td>
              <td className="text-green-600">+5.1%</td>
            </tr>
            <tr>
              <td className="py-3">March</td>
              <td>{user?.currency}72,000</td>
              <td>{user?.currency}76,800</td>
              <td className="text-green-600">+4,800</td>
              <td className="text-green-600">+6.7%</td>
            </tr>
            <tr>
              <td className="py-3">April</td>
              <td>{user?.currency}75,000</td>
              <td>{user?.currency}78,500</td>
              <td className="text-green-600">+3,500</td>
              <td className="text-green-600">+4.7%</td>
            </tr>
            <tr>
              <td className="py-3">May</td>
              <td>{user?.currency}78,000</td>
              <td>{user?.currency}80,200</td>
              <td className="text-green-600">+2,200</td>
              <td className="text-green-600">+2.8%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Variance Analysis by Category</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Revenue</span>
              <span className="text-green-600 font-medium">+8.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '8.2%'}}></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span>Cost of Goods</span>
              <span className="text-green-600 font-medium">-2.1%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '2.1%'}}></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span>Operating Expenses</span>
              <span className="text-green-600 font-medium">-4.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '4.3%'}}></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span>Marketing</span>
              <span className="text-yellow-600 font-medium">+1.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '1.5%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Forecast Accuracy</h3>
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-indigo-600 mb-2">94.2%</div>
            <p className="text-gray-500">Overall Forecast Accuracy</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">±3.2%</div>
                <div className="text-sm text-gray-500">Avg Error Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">8/10</div>
                <div className="text-sm text-gray-500">Months within ±5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
