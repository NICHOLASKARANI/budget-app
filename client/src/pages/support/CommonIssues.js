import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CommonIssues() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Common Issues</h1>
        <p className="mt-2 text-sm text-gray-600">
          Identify frequently reported problems
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Top Issues This Week</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Login Problems</span>
                <span className="font-medium">45 tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Payment Failed</span>
                <span className="font-medium">38 tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '38%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Account Setup</span>
                <span className="font-medium">32 tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '32%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Feature Request</span>
                <span className="font-medium">28 tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '28%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bug Report</span>
                <span className="font-medium">25 tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Issue Categories</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Technical Issues</span>
              <span className="font-medium">35%</span>
            </div>
            <div className="flex justify-between">
              <span>Billing & Payments</span>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span>Account Management</span>
              <span className="font-medium">22%</span>
            </div>
            <div className="flex justify-between">
              <span>Feature Requests</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex justify-between">
              <span>Other</span>
              <span className="font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Issue Trend Analysis</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Issue Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">This Week</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Last Week</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Change</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Login Problems</td>
              <td>45</td>
              <td>52</td>
              <td className="text-green-600">-13.5%</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Improving</span></td>
            </tr>
            <tr>
              <td className="py-3">Payment Failed</td>
              <td>38</td>
              <td>35</td>
              <td className="text-red-600">+8.6%</td>
              <td><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Worsening</span></td>
            </tr>
            <tr>
              <td className="py-3">Account Setup</td>
              <td>32</td>
              <td>28</td>
              <td className="text-red-600">+14.3%</td>
              <td><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Worsening</span></td>
            </tr>
            <tr>
              <td className="py-3">Feature Request</td>
              <td>28</td>
              <td>31</td>
              <td className="text-green-600">-9.7%</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Improving</span></td>
            </tr>
            <tr>
              <td className="py-3">Bug Report</td>
              <td>25</td>
              <td>27</td>
              <td className="text-green-600">-7.4%</td>
              <td><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Improving</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
