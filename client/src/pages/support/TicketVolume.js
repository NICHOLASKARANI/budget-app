import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TicketVolume() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Volume</h1>
        <p className="mt-2 text-sm text-gray-600">
          Analyze support ticket volume trends
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Today</h3>
          <p className="text-2xl font-bold text-gray-900">42</p>
          <p className="text-sm text-green-600 mt-2">-8% vs yesterday</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">This Week</h3>
          <p className="text-2xl font-bold text-gray-900">234</p>
          <p className="text-sm text-green-600 mt-2">-12% vs last week</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-green-600 mt-2">+5% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Open Tickets</h3>
          <p className="text-2xl font-bold text-yellow-600">45</p>
          <p className="text-sm text-gray-500 mt-2">3 urgent</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Daily Ticket Volume</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Day</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">vs Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3">Monday</td>
              <td>42</td>
              <td className="text-green-600">-5%</td>
            </tr>
            <tr>
              <td className="py-3">Tuesday</td>
              <td>38</td>
              <td className="text-green-600">-14%</td>
            </tr>
            <tr>
              <td className="py-3">Wednesday</td>
              <td>45</td>
              <td className="text-red-600">+2%</td>
            </tr>
            <tr>
              <td className="py-3">Thursday</td>
              <td>40</td>
              <td className="text-green-600">-9%</td>
            </tr>
            <tr>
              <td className="py-3">Friday</td>
              <td>35</td>
              <td className="text-green-600">-21%</td>
            </tr>
            <tr>
              <td className="py-3">Saturday</td>
              <td>22</td>
              <td className="text-green-600">-50%</td>
            </tr>
            <tr>
              <td className="py-3">Sunday</td>
              <td>12</td>
              <td className="text-green-600">-73%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Volume by Priority</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Critical
              </span>
              <span className="font-medium">23 (9%)</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                High
              </span>
              <span className="font-medium">78 (31%)</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Medium
              </span>
              <span className="font-medium">92 (37%)</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Low
              </span>
              <span className="font-medium">58 (23%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Volume by Category</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Technical Support</span>
              <span className="font-medium">85 (34%)</span>
            </div>
            <div className="flex justify-between">
              <span>Billing</span>
              <span className="font-medium">62 (25%)</span>
            </div>
            <div className="flex justify-between">
              <span>Account Management</span>
              <span className="font-medium">48 (19%)</span>
            </div>
            <div className="flex justify-between">
              <span>Feature Requests</span>
              <span className="font-medium">32 (13%)</span>
            </div>
            <div className="flex justify-between">
              <span>Other</span>
              <span className="font-medium">23 (9%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
