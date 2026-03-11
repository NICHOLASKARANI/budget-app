import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { businessService } from '../../services/dataService';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenue: { total: 0, monthlyData: [] },
    costs: { total: 0 },
    cashFlow: { operating: 0, monthlyData: [] },
    budget: { departments: [] },
    forecast: { data: [] }
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const revenue = await businessService.getRevenue(dateRange);
      const costs = await businessService.getCosts(dateRange);
      const cashFlow = await businessService.getCashFlow(dateRange);
      const budget = await businessService.getBudgetUtilization();
      const forecast = await businessService.getForecast();
      
      setData({ revenue, costs, cashFlow, budget, forecast });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalRevenue = data.revenue.total || 0;
  const totalCosts = data.costs.total || 0;
  const grossProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100).toFixed(1) : 0;
  const operatingCashFlow = data.cashFlow.operating || 0;

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
                <BarChart data={data.revenue.monthlyData}>
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
                <LineChart data={data.revenue.profitMarginData}>
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
              <AreaChart data={data.cashFlow.monthlyData}>
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

        {/* Budget Utilization */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Utilization by Department</h3>
          <div className="space-y-4">
            {data.budget.departments.map((dept) => (
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
              <LineChart data={data.forecast.data}>
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
    </div>
  );
}
