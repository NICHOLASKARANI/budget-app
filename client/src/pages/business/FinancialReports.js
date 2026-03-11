import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FinancialReports() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate comprehensive financial statements
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Profit & Loss</h3>
          <p className="text-sm text-gray-500 mb-4">Income statement for period ending Mar 2026</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">{user?.currency} 46,550</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Net Profit</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Balance Sheet</h3>
          <p className="text-sm text-gray-500 mb-4">As of March 31, 2026</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">{user?.currency} 425,000</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Total Assets</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Cash Flow</h3>
          <p className="text-sm text-gray-500 mb-4">Statement for Q1 2026</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-purple-600">{user?.currency} 36,500</span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Net Cash Flow</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Monthly P&L</td>
              <td>March 2026</td>
              <td>Apr 1, 2026</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Final</span></td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Quarterly Balance Sheet</td>
              <td>Q1 2026</td>
              <td>Apr 1, 2026</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Final</span></td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Cash Flow Statement</td>
              <td>Q1 2026</td>
              <td>Apr 1, 2026</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Final</span></td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Budget vs Actual</td>
              <td>March 2026</td>
              <td>Apr 1, 2026</td>
              <td><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Draft</span></td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Generate Report</h3>
          <div className="space-y-4">
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Profit & Loss Statement</option>
              <option>Balance Sheet</option>
              <option>Cash Flow Statement</option>
              <option>Budget vs Actual</option>
            </select>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>March 2026</option>
              <option>Q1 2026</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
            <button className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700">
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Export Options</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <span className="flex-1">PDF Document</span>
              <span className="text-sm text-gray-500">For printing & sharing</span>
            </div>
            <div className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <span className="flex-1">Excel Spreadsheet</span>
              <span className="text-sm text-gray-500">For further analysis</span>
            </div>
            <div className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <span className="flex-1">CSV File</span>
              <span className="text-sm text-gray-500">For data import</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
