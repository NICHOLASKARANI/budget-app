import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ResponseTime() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Response Time</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor initial response times to customer inquiries
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Response Time</h3>
          <p className="text-3xl font-bold text-green-600">1.3h</p>
          <p className="text-sm text-gray-500 mt-2">Target: 2h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Fastest Response</h3>
          <p className="text-3xl font-bold text-blue-600">0.2h</p>
          <p className="text-sm text-gray-500 mt-2">(12 minutes)</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Slowest Response</h3>
          <p className="text-3xl font-bold text-yellow-600">3.5h</p>
          <p className="text-sm text-gray-500 mt-2">Above target</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Response Time by Channel</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">SLA Met</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Email</td>
              <td>2.5h</td>
              <td>45%</td>
              <td>92%</td>
            </tr>
            <tr>
              <td className="py-3">Chat</td>
              <td>0.3h</td>
              <td>35%</td>
              <td>98%</td>
            </tr>
            <tr>
              <td className="py-3">Phone</td>
              <td>0.1h</td>
              <td>15%</td>
              <td>99%</td>
            </tr>
            <tr>
              <td className="py-3">Social Media</td>
              <td>1.8h</td>
              <td>5%</td>
              <td>88%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Response Time by Team</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 1 Support</span>
                <span>1.1h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '55%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 2 Support</span>
                <span>1.5h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tier 3 Support</span>
                <span>1.8h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Response Time Trend</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Hour</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg Response</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2">0-4</td>
                <td>2.1h</td>
                <td>45</td>
              </tr>
              <tr>
                <td className="py-2">4-8</td>
                <td>1.8h</td>
                <td>78</td>
              </tr>
              <tr>
                <td className="py-2">8-12</td>
                <td>0.9h</td>
                <td>234</td>
              </tr>
              <tr>
                <td className="py-2">12-16</td>
                <td>1.1h</td>
                <td>312</td>
              </tr>
              <tr>
                <td className="py-2">16-20</td>
                <td>1.3h</td>
                <td>289</td>
              </tr>
              <tr>
                <td className="py-2">20-24</td>
                <td>1.9h</td>
                <td>156</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
