import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function BudgetUtilization() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budget Utilization</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track budget allocation and spending
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Department Budgets</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Marketing</span>
                <span>,500 / ,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sales</span>
                <span>,250 / ,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '91%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>R&D</span>
                <span>,000 / ,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Operations</span>
                <span>,000 / ,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Budget Summary</h3>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Budget</dt>
              <dd className="font-medium">{user?.currency} 325,000</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Spent</dt>
              <dd className="font-medium">{user?.currency} 278,750</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Remaining</dt>
              <dd className="font-medium text-green-600">{user?.currency} 46,250</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Utilization Rate</dt>
              <dd className="font-medium">85.8%</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Budget Allocation by Department</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3">Marketing</td>
                <td>{user?.currency}50,000</td>
                <td>{user?.currency}42,500</td>
                <td>{user?.currency}7,500</td>
                <td>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </td>
                <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">On Track</span></td>
              </tr>
              <tr>
                <td className="py-3">Sales</td>
                <td>{user?.currency}75,000</td>
                <td>{user?.currency}68,250</td>
                <td>{user?.currency}6,750</td>
                <td>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '91%'}}></div>
                  </div>
                </td>
                <td><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Near Limit</span></td>
              </tr>
              <tr>
                <td className="py-3">R&D</td>
                <td>{user?.currency}120,000</td>
                <td>{user?.currency}96,000</td>
                <td>{user?.currency}24,000</td>
                <td>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </td>
                <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">On Track</span></td>
              </tr>
              <tr>
                <td className="py-3">Operations</td>
                <td>{user?.currency}80,000</td>
                <td>{user?.currency}72,000</td>
                <td>{user?.currency}8,000</td>
                <td>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </td>
                <td><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Near Limit</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
