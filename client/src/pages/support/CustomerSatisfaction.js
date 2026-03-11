import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerSatisfaction() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Satisfaction</h1>
        <p className="mt-2 text-sm text-gray-600">
          Measure CSAT scores and feedback
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Overall CSAT</h3>
          <p className="text-3xl font-bold text-green-600">94%</p>
          <p className="text-sm text-gray-500 mt-2">Target: 95%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Response Satisfaction</h3>
          <p className="text-3xl font-bold text-blue-600">92%</p>
          <p className="text-sm text-gray-500 mt-2">Target: 90%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Resolution Satisfaction</h3>
          <p className="text-3xl font-bold text-purple-600">95%</p>
          <p className="text-sm text-gray-500 mt-2">Target: 93%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Responses</h3>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">CSAT Trend</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">CSAT</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2">Week 1</td>
                <td>92%</td>
                <td className="text-green-600">+1%</td>
              </tr>
              <tr>
                <td className="py-2">Week 2</td>
                <td>93%</td>
                <td className="text-green-600">+1%</td>
              </tr>
              <tr>
                <td className="py-2">Week 3</td>
                <td>95%</td>
                <td className="text-green-600">+2%</td>
              </tr>
              <tr>
                <td className="py-2">Week 4</td>
                <td>94%</td>
                <td className="text-red-600">-1%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Feedback Categories</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Very Satisfied (5 stars)</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '68%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfied (4 stars)</span>
                <span>22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '22%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Neutral (3 stars)</span>
                <span>6%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '6%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Unsatisfied (1-2 stars)</span>
                <span>4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{width: '4%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">John D.</span>
              <span className="text-yellow-500">★★★★★</span>
            </div>
            <p className="text-gray-600">"Excellent support, resolved my issue quickly!"</p>
          </div>
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Sarah M.</span>
              <span className="text-yellow-500">★★★★☆</span>
            </div>
            <p className="text-gray-600">"Good service, but response time could be faster."</p>
          </div>
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Mike T.</span>
              <span className="text-yellow-500">★★★★★</span>
            </div>
            <p className="text-gray-600">"Very helpful team, went above and beyond!"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
