import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SupportReports() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate support analytics reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Weekly Summary</h3>
          <p className="text-sm text-gray-500 mb-4">Mar 23 - Mar 29, 2026</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tickets</span>
              <span className="font-medium">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CSAT</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">1.3h</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Monthly Report</h3>
          <p className="text-sm text-gray-500 mb-4">March 2026</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tickets</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CSAT</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolution Rate</span>
              <span className="font-medium">92%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-medium mb-2">Quarterly Review</h3>
          <p className="text-sm text-gray-500 mb-4">Q1 2026</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tickets</span>
              <span className="font-medium">3,892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg CSAT</span>
              <span className="font-medium text-green-600">93%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Team Performance</span>
              <span className="font-medium">92%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Available Reports</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Last Generated</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Daily Support Summary</td>
              <td>Daily</td>
              <td>Today, 9:00 AM</td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Weekly Performance Report</td>
              <td>Weekly</td>
              <td>Yesterday, 11:30 PM</td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Monthly CSAT Analysis</td>
              <td>Monthly</td>
              <td>Apr 1, 2026</td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Team Performance Review</td>
              <td>Monthly</td>
              <td>Apr 1, 2026</td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
            <tr>
              <td className="py-3">Issue Trend Analysis</td>
              <td>Quarterly</td>
              <td>Apr 1, 2026</td>
              <td><button className="text-indigo-600 hover:text-indigo-800">Download</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Generate Custom Report</h3>
          <div className="space-y-4">
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Daily Summary</option>
              <option>Weekly Performance</option>
              <option>Monthly Analysis</option>
              <option>Quarterly Review</option>
            </select>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last quarter</option>
              <option>Custom range</option>
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
              <span className="text-sm text-gray-500">For presentations</span>
            </div>
            <div className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <span className="flex-1">Excel Spreadsheet</span>
              <span className="text-sm text-gray-500">For analysis</span>
            </div>
            <div className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <span className="flex-1">CSV File</span>
              <span className="text-sm text-gray-500">Raw data export</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
