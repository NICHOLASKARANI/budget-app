import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  PencilIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const categories = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Insurance',
  'Debt',
  'Entertainment',
  'Shopping',
  'Health',
  'Subscriptions',
  'Other'
];

export default function BudgetPlanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  // Fetch budget data
  const { data: budgets, isLoading } = useQuery(
    ['budgets', selectedMonth, selectedYear],
    () => api.get('/budgets', { params: { month: selectedMonth, year: selectedYear } }).then(res => res.data)
  );

  // Fetch actual expenses
  const { data: expenses } = useQuery(
    ['expenses', selectedMonth, selectedYear],
    () => api.get('/expenses', { params: { month: selectedMonth, year: selectedYear } }).then(res => res.data)
  );

  // Update budget mutation
  const updateBudgetMutation = useMutation(
    (data) => api.post('/budgets', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('budgets');
        toast.success('Budget updated');
        setEditingCategory(null);
        setBudgetAmount('');
      },
      onError: () => toast.error('Failed to update budget')
    }
  );

  // Calculate actual spending by category
  const actualSpending = expenses?.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {}) || {};

  const handleSetBudget = (category) => {
    if (!budgetAmount) return;
    updateBudgetMutation.mutate({
      category,
      budget_amount: parseFloat(budgetAmount),
      month: selectedMonth,
      year: selectedYear
    });
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Budget Planner</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Plan and track your monthly budget
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
                  {format(new Date(2000, month - 1, 1), 'MMM')}
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

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {user?.currency} {budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0).toFixed(2) || '0.00'}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {user?.currency} {Object.values(actualSpending).reduce((a, b) => a + b, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {user?.currency} {(
                (budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0) || 0) -
                Object.values(actualSpending).reduce((a, b) => a + b, 0)
              ).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">
              {budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0) > 0
                ? ((Object.values(actualSpending).reduce((a, b) => a + b, 0) / 
                   budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0)) * 100).toFixed(1)
                : '0'}%
            </p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {categories.map((category) => {
                const budget = budgets?.find(b => b.category === category);
                const budgetAmount = budget ? parseFloat(budget.budget_amount) : 0;
                const actual = actualSpending[category] || 0;
                const difference = budgetAmount - actual;
                const isOverBudget = difference < 0;
                const progress = budgetAmount > 0 ? (actual / budgetAmount) * 100 : 0;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{category}</span>
                        {editingCategory === category ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={budgetAmount}
                              onChange={(e) => setBudgetAmount(e.target.value)}
                              className="w-24 px-2 py-1 border-2 border-gray-200 rounded-lg text-sm"
                              placeholder="Amount"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSetBudget(category)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(null);
                                setBudgetAmount('');
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setBudgetAmount(budgetAmount);
                            }}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          Budget: {user?.currency} {budgetAmount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Actual: {user?.currency} {actual.toFixed(2)}
                        </span>
                        <span className={	ext-sm font-medium }>
                          {difference >= 0 ? '+' : ''}{user?.currency} {difference.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={h-2.5 rounded-full transition-all duration-500 }
                        style={{ width: ${Math.min(progress, 100)}% }}
                      />
                    </div>

                    {/* Status */}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{progress.toFixed(1)}% used</span>
                      {isOverBudget ? (
                        <span className="text-red-600">Over budget by {user?.currency} {Math.abs(difference).toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600">{user?.currency} {difference.toFixed(2)} remaining</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
