import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ResolutionTime() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resolution Time</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track time to resolve customer issues
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Resolution Time</h3>
          <p className="text-3xl font-bold text-yellow-600">4.5h</p>
          <p className="text-sm text-gray-500 mt-2">Target: 24h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Median Resolution Time</h3>
          <p className="text-3xl font-bold text-green-600">3.2h</p>
          <p className="text-sm text-gray-500 mt-2">Better than average</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tickets within SLA</h3>
          <p className="text-3xl font-bold text-green-600">88%</p>
          <p className="text-sm text-gray-500 mt-2">Target: 90%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Resolution Time by Priority</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Average Time</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Critical</td>
              <td>1.2h</td>
              <td>2h</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Meeting</span></td>
            </tr>
            <tr>
              <td className="py-3">High</td>
              <td>3.5h</td>
              <td>4h</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Meeting</span></td>
            </tr>
            <tr>
              <td className="py-3">Medium</td>
              <td>6.8h</td>
              <td>8h</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Meeting</span></td>
            </tr>
            <tr>
              <td className="py-3">Low</td>
              <td>12.5h</td>
              <td>24h</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Meeting</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Resolution Time by Team</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 1 Support</span>
                <span>2.5h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 2 Support</span>
                <span>4.2h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '82%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 3 Support</span>
                <span>6.8h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Resolution Time Trend</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2">Week 1</td>
                <td>5.2h</td>
                <td className="text-red-600">+0.7h</td>
              </tr>
              <tr>
                <td className="py-2">Week 2</td>
                <td>4.8h</td>
                <td className="text-green-600">-0.4h</td>
              </tr>
              <tr>
                <td className="py-2">Week 3</td>
                <td>4.5h</td>
                <td className="text-green-600">-0.3h</td>
              </tr>
              <tr>
                <td className="py-2">Week 4</td>
                <td>4.5h</td>
                <td className="text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
