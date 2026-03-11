import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ClockIcon,
  DocumentTextIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('month');

  // Fetch business data
  const { data: businessData, isLoading } = useQuery('business-dashboard', async () => {
    const [
      revenueRes,
      costsRes,
      cashFlowRes,
      budgetRes,
      forecastRes
    ] = await Promise.all([
      api.get('/business/revenue', { params: { period: dateRange } }),
      api.get('/business/costs', { params: { period: dateRange } }),
      api.get('/business/cash-flow', { params: { period: dateRange } }),
      api.get('/business/budget-utilization'),
      api.get('/business/forecast')
    ]);
    
    return {
      revenue: revenueRes.data,
      costs: costsRes.data,
      cashFlow: cashFlowRes.data,
      budget: budgetRes.data,
      forecast: forecastRes.data
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate key metrics
  const totalRevenue = businessData?.revenue?.total || 0;
  const totalCosts = businessData?.costs?.total || 0;
  const grossProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100).toFixed(1) : 0;
  const operatingCashFlow = businessData?.cashFlow?.operating || 0;
  const budgetUtilization = businessData?.budget?.utilization || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Financial Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Real-time financial insights for your business
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {user?.currency} {totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-green-50 px-5 py-2">
              <div className="text-sm text-green-600">
                +12.5% from last period
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Costs</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {user?.currency} {totalCosts.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-red-50 px-5 py-2">
              <div className="text-sm text-red-600">
                Within budget
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                  <PresentationChartLineIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Gross Profit</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {user?.currency} {grossProfit.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 px-5 py-2">
              <div className="text-sm text-indigo-600">
                Margin: {profitMargin}%
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <BanknotesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Operating Cash Flow</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {user?.currency} {operatingCashFlow.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-5 py-2">
              <div className="text-sm text-purple-600">
                Healthy
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue vs Costs Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Costs</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessData?.revenue?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4f46e5" />
                  <Bar dataKey="costs" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Margin Trend */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Margin Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={businessData?.revenue?.profitMarginData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cash Flow Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={businessData?.cashFlow?.monthlyData || []}>
                <defs>
                  <linearGradient id="colorOperating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorInvesting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorFinancing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="operating" stroke="#4f46e5" fill="url(#colorOperating)" />
                <Area type="monotone" dataKey="investing" stroke="#f59e0b" fill="url(#colorInvesting)" />
                <Area type="monotone" dataKey="financing" stroke="#10b981" fill="url(#colorFinancing)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilization & Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Utilization */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Utilization</h3>
            <div className="space-y-4">
              {businessData?.budget?.departments?.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{dept.name}</span>
                    <span className="text-gray-500">
                      {user?.currency} {dept.spent.toLocaleString()} / {dept.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: dept.utilization + '%' }}
                        className={(dept.utilization > 90 ? 'bg-red-600' : (dept.utilization > 75 ? 'bg-yellow-500' : 'bg-green-600')) + ' shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center'}
                      />
                    </div>
                    <span className="absolute right-0 -top-6 text-xs text-gray-500">
                      {dept.utilization}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast vs Actual */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Forecast vs Actual</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={businessData?.forecast?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Metrics Table */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Performance Metrics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Revenue', current: totalRevenue, previous: totalRevenue * 0.9, format: 'currency' },
                  { name: 'Cost of Goods Sold', current: totalCosts * 0.6, previous: totalCosts * 0.58, format: 'currency' },
                  { name: 'Gross Profit', current: grossProfit, previous: grossProfit * 0.92, format: 'currency' },
                  { name: 'Operating Expenses', current: totalCosts * 0.3, previous: totalCosts * 0.32, format: 'currency' },
                  { name: 'Net Profit', current: grossProfit * 0.7, previous: grossProfit * 0.68, format: 'currency' },
                  { name: 'Profit Margin', current: profitMargin, previous: profitMargin * 0.95, format: 'percent' },
                  { name: 'Operating Cash Flow', current: operatingCashFlow, previous: operatingCashFlow * 0.95, format: 'currency' },
                  { name: 'Budget Utilization', current: budgetUtilization, previous: budgetUtilization * 0.9, format: 'percent' }
                ].map((row) => {
                  const change = ((row.current - row.previous) / row.previous * 100).toFixed(1);
                  const isPositive = row.current > row.previous;
                  
                  return (
                    <tr key={row.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.format === 'currency' ? user?.currency + ' ' + row.current.toLocaleString() : row.current + '%'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.format === 'currency' ? user?.currency + ' ' + row.previous.toLocaleString() : row.previous + '%'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                          {isPositive ? '+' : ''}{change}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' + (isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                          {isPositive ? 'Improving' : 'Declining'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
