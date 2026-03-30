import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PencilIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const categories = ['Housing', 'Food', 'Transport', 'Utilities', 'Insurance', 'Debt', 'Entertainment', 'Shopping', 'Health', 'Subscriptions'];

export default function BudgetPlanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');

  const { data: budgets } = useQuery(['budgets', selectedMonth, selectedYear], () => api.get('/budgets', { params: { month: selectedMonth, year: selectedYear } }).catch(() => []));
  const { data: expenses } = useQuery(['expenses', selectedMonth, selectedYear], () => api.get('/expenses', { params: { month: selectedMonth, year: selectedYear } }).catch(() => []));

  const updateBudget = useMutation(
    (data) => api.post('/budgets', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('budgets');
        toast.success('✅ Budget updated!');
        setEditingCategory(null);
        setBudgetAmount('');
      },
      onError: (error) => toast.error('Failed to update: ' + (error.response?.data?.error || error.message))
    }
  );

  const actualSpending = expenses?.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount); return acc; }, {}) || {};

  const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0) || 0;
  const totalSpent = Object.values(actualSpending).reduce((a, b) => a + b, 0);
  const utilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Planner</h1><p className="text-gray-600 dark:text-gray-400">Plan and track your monthly budget</p></div>
          <div className="flex gap-3"><select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="p-2 border rounded-lg"><option value="">Month</option>{Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{format(new Date(2000, m-1, 1), 'MMMM')}</option>)}</select><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="p-2 border rounded-lg"><option>2024</option><option>2025</option><option>2026</option></select></div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Budget</p><p className="text-2xl font-bold">{user?.currency} {totalBudget.toFixed(2)}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Spent</p><p className="text-2xl font-bold text-red-600">{user?.currency} {totalSpent.toFixed(2)}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Remaining</p><p className="text-2xl font-bold text-green-600">{user?.currency} {(totalBudget - totalSpent).toFixed(2)}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Utilization</p><p className="text-2xl font-bold text-indigo-600">{utilization}%</p></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {categories.map(cat => {
            const budget = budgets?.find(b => b.category === cat);
            const budgetVal = budget ? parseFloat(budget.budget_amount) : 0;
            const actual = actualSpending[cat] || 0;
            const diff = budgetVal - actual;
            const isOver = diff < 0;
            const progress = budgetVal > 0 ? (actual / budgetVal) * 100 : 0;

            return (
              <div key={cat} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{cat}</span>
                  <div className="flex items-center gap-4">
                    {editingCategory === cat ? (<><input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="w-24 p-1 border rounded" autoFocus /><button onClick={() => updateBudget.mutate({ category: cat, budget_amount: parseFloat(budgetAmount), month: selectedMonth, year: selectedYear })} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">Save</button><button onClick={() => { setEditingCategory(null); setBudgetAmount(''); }} className="px-2 py-1 bg-gray-300 rounded text-sm">Cancel</button></>) : (<><span>Budget: {user?.currency} {budgetVal.toFixed(2)}</span><span>Actual: {user?.currency} {actual.toFixed(2)}</span><span className={isOver ? 'text-red-600' : 'text-green-600'}>{diff >= 0 ? '+' : ''}{user?.currency} {Math.abs(diff).toFixed(2)}</span><button onClick={() => { setEditingCategory(cat); setBudgetAmount(budgetVal); }} className="text-indigo-600"><PencilIcon className="h-4 w-4" /></button></>)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className={h-2 rounded-full } style={{ width: Math.min(progress, 100) + '%' }} /></div>
                <div className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% used</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
