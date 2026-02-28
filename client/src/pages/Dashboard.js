import React from 'react';
import { useQuery } from 'react-query';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const monthlyData = [
  { name: 'Jan', income: 5000, expenses: 4200 },
  { name: 'Feb', income: 5200, expenses: 4300 },
  { name: 'Mar', income: 4800, expenses: 4100 },
  { name: 'Apr', income: 5100, expenses: 4400 },
  { name: 'May', income: 5300, expenses: 4500 },
  { name: 'Jun', income: 5500, expenses: 4600 },
];

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery('dashboard', async () => {
    try {
      const [incomeRes, expensesRes] = await Promise.all([
        api.get('/income/summary'),
        api.get('/expenses/categories')
      ]);
      
      return {
        totalIncome: incomeRes.data.reduce((sum, item) => sum + parseFloat(item.total), 0),
        totalExpenses: expensesRes.data.reduce((sum, item) => sum + parseFloat(item.total), 0),
        categories: expensesRes.data
      };
    } catch (error) {
      // Return mock data if API is not ready
      return {
        totalIncome: 32000,
        totalExpenses: 26500,
        categories: [
          { category: 'Housing', total: 12000 },
          { category: 'Food', total: 4800 },
          { category: 'Transport', total: 3200 },
          { category: 'Utilities', total: 2400 },
          { category: 'Entertainment', total: 2100 },
          { category: 'Other', total: 2000 }
        ]
      };
    }
  });

  if (isLoading) return <LoadingSpinner />;

  const savings = (summary?.totalIncome || 0) - (summary?.totalExpenses || 0);
  const savingsRate = summary?.totalIncome > 0 
    ? ((savings / summary.totalIncome) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={$}
          icon={CurrencyDollarIcon}
          color="green"
          trend="+12%"
        />
        <StatCard
          title="Total Expenses"
          value={$}
          icon={CreditCardIcon}
          color="red"
          trend="+8%"
        />
        <StatCard
          title="Net Savings"
          value={$}
          icon={TrendingUpIcon}
          color="blue"
          trend={savings > 0 ? '+' + ((savings / summary?.totalIncome) * 100).toFixed(1) + '%' : '0%'}
        />
        <StatCard
          title="Savings Rate"
          value={${savingsRate}%}
          icon={TrendingDownIcon}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium mb-4">Income vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.categories || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => ${category} %}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="category"
                >
                  {summary?.categories?.map((entry, index) => (
                    <Cell key={cell-} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4f46e5" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
