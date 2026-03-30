import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PencilIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const categories = ['Housing', 'Food', 'Transport', 'Utilities', 'Insurance', 'Debt', 'Entertainment', 'Shopping', 'Health', 'Subscriptions'];

export default function BudgetPlanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const { data: budgets = [], isLoading } = useQuery(['budgets', selectedMonth, selectedYear], async () => {
    try {
      const response = await api.get('/budgets', { params: { month: selectedMonth, year: selectedYear } });
      return response.data || [];
    } catch (err) {
      return [];
    }
  });

  const { data: expenses = [] } = useQuery(['expenses', selectedMonth, selectedYear], async () => {
    try {
      const response = await api.get('/expenses', { params: { month: selectedMonth, year: selectedYear } });
      return response.data || [];
    } catch (err) {
      return [];
    }
  });

  const updateBudget = useMutation(
    async (data) => {
      const response = await api.post('/budgets', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['budgets', selectedMonth, selectedYear]);
        toast.success('Budget updated!');
        setEditingCategory(null);
        setBudgetAmount('');
      },
      onError: () => toast.error('Failed to update budget')
    }
  );

  const actualSpending = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0);
  const totalSpent = Object.values(actualSpending).reduce((a, b) => a + b, 0);
  const utilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Planner</h1>
            <p className="text-gray-600 dark:text-gray-400">Plan and track your monthly budget</p>
          </div>
          <div className="flex gap-3">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="p-2 border rounded-lg dark:bg-gray-800">
              {monthNames.map((month, idx) => (<option key={idx + 1} value={idx + 1}>{month}</option>))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="p-2 border rounded-lg dark:bg-gray-800">
              <option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 text-sm">Total Budget</p>
            <p className="text-2xl font-bold">{user?.currency} {totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">{user?.currency} {totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 text-sm">Remaining</p>
            <p className="text-2xl font-bold text-green-600">{user?.currency} {(totalBudget - totalSpent).toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 text-sm">Utilization</p>
            <p className="text-2xl font-bold text-indigo-600">{utilization}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          {categories.map(cat => {
            const budget = budgets.find(b => b.category === cat);
            const budgetVal = budget ? parseFloat(budget.budget_amount) : 0;
            const actual = actualSpending[cat] || 0;
            const diff = budgetVal - actual;
            const isOver = diff < 0;
            const progress = budgetVal > 0 ? (actual / budgetVal) * 100 : 0;
            const progressColor = isOver ? 'bg-red-600' : (progress > 80 ? 'bg-yellow-500' : 'bg-green-600');
            const diffColor = isOver ? 'text-red-600' : 'text-green-600';

            return (
              <div key={cat} className="mb-6 last:mb-0 border-b last:border-0 pb-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <span className="font-semibold w-28">{cat}</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm">Budget: {user?.currency} {budgetVal.toFixed(2)}</span>
                    <span className="text-sm">Actual: {user?.currency} {actual.toFixed(2)}</span>
                    <span className={"text-sm font-medium " + diffColor}>
                      {diff >= 0 ? '+' : ''}{user?.currency} {Math.abs(diff).toFixed(2)}
                    </span>
                    {editingCategory === cat ? (
                      <div className="flex gap-2">
                        <input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="w-24 p-1 border rounded text-sm" autoFocus />
                        <button onClick={() => updateBudget.mutate({ category: cat, budget_amount: parseFloat(budgetAmount), month: selectedMonth, year: selectedYear })} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">Save</button>
                        <button onClick={() => { setEditingCategory(null); setBudgetAmount(''); }} className="px-2 py-1 bg-gray-300 rounded text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingCategory(cat); setBudgetAmount(budgetVal); }} className="text-indigo-600"><PencilIcon className="h-4 w-4" /></button>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className={"h-2 rounded-full " + progressColor} style={{ width: Math.min(progress, 100) + '%' }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% used</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
