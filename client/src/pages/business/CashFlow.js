import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CashFlow() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cash Flow</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor operating, investing, and financing cash flows
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Operating Cash Flow</h3>
          <p className="text-2xl font-bold text-green-600">{user?.currency} 42,500</p>
          <p className="text-sm text-gray-500 mt-2">+8.3% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Investing Cash Flow</h3>
          <p className="text-2xl font-bold text-red-600">{user?.currency} -15,000</p>
          <p className="text-sm text-gray-500 mt-2">Capital expenditures</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Financing Cash Flow</h3>
          <p className="text-2xl font-bold text-blue-600">{user?.currency} 10,000</p>
          <p className="text-sm text-gray-500 mt-2">Debt financing</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Cash Flow Statement</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Jan</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Feb</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Mar</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Apr</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">May</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase">Jun</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 font-medium">Operating</td>
              <td>32,000</td>
              <td>38,000</td>
              <td>35,000</td>
              <td>41,000</td>
              <td>43,000</td>
              <td>47,000</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Investing</td>
              <td>-5,000</td>
              <td>-8,000</td>
              <td>-6,000</td>
              <td>-10,000</td>
              <td>-12,000</td>
              <td>-15,000</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Financing</td>
              <td>2,000</td>
              <td>3,000</td>
              <td>2,500</td>
              <td>4,000</td>
              <td>3,500</td>
              <td>4,500</td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="py-3">Net Cash Flow</td>
              <td>29,000</td>
              <td>33,000</td>
              <td>31,500</td>
              <td>35,000</td>
              <td>34,500</td>
              <td>36,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
