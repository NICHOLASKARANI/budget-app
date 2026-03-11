import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  TrendingUpIcon,
  ChartBarIcon
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
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function MonthlyDashboard() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState('area');

  // Fetch monthly data
  const { data: monthlyData, isLoading } = useQuery(
    ['monthly-dashboard', selectedYear],
    () => api.get('/dashboard/monthly', { params: { year: selectedYear } }).then(res => res.data)
  );

  // Fetch current month breakdown
  const { data: categoryData } = useQuery(
    ['category-breakdown', selectedYear, selectedMonth],
    () => api.get('/expenses/categories', { params: { year: selectedYear, month: selectedMonth } }).then(res => res.data)
  );

  // Fetch daily data for current month
  const { data: dailyData } = useQuery(
    ['daily-data', selectedYear, selectedMonth],
    async () => {
      const [incomeRes, expensesRes] = await Promise.all([
        api.get('/income', { params: { year: selectedYear, month: selectedMonth } }),
        api.get('/expenses', { params: { year: selectedYear, month: selectedMonth } })
      ]);
      
      // Group by day
      const daily = {};
      [...incomeRes.data, ...expensesRes.data].forEach(item => {
        const day = format(new Date(item.date), 'dd');
        if (!daily[day]) {
          daily[day] = { day, income: 0, expenses: 0 };
        }
        if (item.source) {
          daily[day].income += parseFloat(item.amount);
        } else {
          daily[day].expenses += parseFloat(item.amount);
        }
      });
      
      return Object.values(daily).sort((a, b) => parseInt(a.day) - parseInt(b.day));
    }
  );

  const currentMonthData = monthlyData?.find(d => d.month_num === selectedMonth);
  const totalIncome = currentMonthData?.income || 0;
  const totalExpenses = currentMonthData?.expenses || 0;
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={dailyData || []}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="income" stroke="#4f46e5" fill="url(#incomeGradient)" />
            <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expensesGradient)" />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={dailyData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4f46e5" />
            <Bar dataKey="expenses" fill="#ef4444" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={dailyData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Monthly Dashboard</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Detailed view of your monthly finances
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {format(new Date(2000, month - 1, 1), 'MMMM')}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="block w-24 pl-3 pr-10 py-2 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[2024, 2025, 2026, 2027, 2028].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-indigo-100">Total Income</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-red-100">Total Expenses</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {totalExpenses.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-green-100">Savings</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {savings.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-purple-100">Savings Rate</p>
            <p className="text-3xl font-bold mt-2">{savingsRate}%</p>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Breakdown</h3>
            <div className="flex gap-2">
              {['area', 'bar', 'line'].map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={px-4 py-2 rounded-lg font-medium transition-colors }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => ${category} %}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="category"
                  >
                    {categoryData?.map((entry, index) => {
                      const cellKey = 'cell-' + index;
                      return (
                        <Cell key={cellKey} fill={COLORS[index % COLORS.length]} />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Details</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {categoryData?.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <span className="text-indigo-600 font-medium">
                    {user?.currency} {parseFloat(item.total).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Transactions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dailyData?.slice(0, 10).map((day, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-600">Day {day.day}</td>
                    <td className="py-3 text-sm text-gray-800">Daily Summary</td>
                    <td className="py-3 text-sm text-gray-600">-</td>
                    <td className="py-3 text-sm text-right">
                      <span className="text-green-600">+{user?.currency} {day.income?.toFixed(2) || '0.00'}</span>
                      <span className="mx-2">/</span>
                      <span className="text-red-600">-{user?.currency} {day.expenses?.toFixed(2) || '0.00'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
