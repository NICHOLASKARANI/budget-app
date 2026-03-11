import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TeamPerformance() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
        <p className="mt-2 text-sm text-gray-600">
          Evaluate individual and team support metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Team Efficiency</h3>
          <p className="text-2xl font-bold text-green-600">92%</p>
          <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tickets Resolved</h3>
          <p className="text-2xl font-bold text-blue-600">1,892</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg per Agent</h3>
          <p className="text-2xl font-bold text-purple-600">189</p>
          <p className="text-sm text-gray-500 mt-2">Tickets per agent</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Team CSAT</h3>
          <p className="text-2xl font-bold text-green-600">94%</p>
          <p className="text-sm text-gray-500 mt-2">Above target</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Individual Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Tickets Assigned</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Tickets Resolved</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Resolution Rate</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg Response</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Avg Resolution</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">CSAT</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3">John Smith</td>
                <td>245</td>
                <td>238</td>
                <td>97%</td>
                <td>1.2h</td>
                <td>3.8h</td>
                <td>96%</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="text-xs">95%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3">Sarah Johnson</td>
                <td>252</td>
                <td>241</td>
                <td>96%</td>
                <td>1.1h</td>
                <td>4.2h</td>
                <td>94%</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-xs">92%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3">Mike Wilson</td>
                <td>238</td>
                <td>225</td>
                <td>95%</td>
                <td>1.4h</td>
                <td>4.5h</td>
                <td>93%</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                    <span className="text-xs">88%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3">Emily Brown</td>
                <td>241</td>
                <td>232</td>
                <td>96%</td>
                <td>1.3h</td>
                <td>4.1h</td>
                <td>95%</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '93%'}}></div>
                    </div>
                    <span className="text-xs">93%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3">David Lee</td>
                <td>258</td>
                <td>236</td>
                <td>91%</td>
                <td>1.5h</td>
                <td>5.2h</td>
                <td>92%</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '86%'}}></div>
                    </div>
                    <span className="text-xs">86%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-green-50 rounded">
              <span className="w-8 text-lg">🥇</span>
              <span className="flex-1 font-medium">Sarah Johnson</span>
              <span className="text-green-600">96% CSAT</span>
            </div>
            <div className="flex items-center p-2 bg-blue-50 rounded">
              <span className="w-8 text-lg">🥈</span>
              <span className="flex-1 font-medium">John Smith</span>
              <span className="text-blue-600">238 resolved</span>
            </div>
            <div className="flex items-center p-2 bg-purple-50 rounded">
              <span className="w-8 text-lg">🥉</span>
              <span className="flex-1 font-medium">Emily Brown</span>
              <span className="text-purple-600">1.3h response</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Team Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly Resolution Target</span>
                <span>1,892 / 2,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CSAT Goal</span>
                <span>94% / 95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '99%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time Target</span>
                <span>1.3h / 2h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
