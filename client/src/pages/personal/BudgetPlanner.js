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

  const { data: budgets } = useQuery(['budgets', selectedMonth, selectedYear], () => 
    api.get('/budgets', { params: { month: selectedMonth, year: selectedYear } }).catch(() => [])
  );

  const { data: expenses } = useQuery(['expenses', selectedMonth, selectedYear], () => 
    api.get('/expenses', { params: { month: selectedMonth, year: selectedYear } }).catch(() => [])
  );

  const updateBudget = useMutation(
    (data) => api.post('/budgets', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('budgets');
        toast.success('Budget updated!');
        setEditingCategory(null);
        setBudgetAmount('');
      },
      onError: () => toast.error('Failed to update budget')
    }
  );

  const actualSpending = expenses?.reduce((acc, e) => { 
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount); 
    return acc; 
  }, {}) || {};

  const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.budget_amount), 0) || 0;
  const totalSpent = Object.values(actualSpending).reduce((a, b) => a + b, 0);
  const utilization = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Budget Planner</h1>
            <p style={{ color: '#6b7280' }}>Plan and track your monthly budget</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white' }}
            >
              {monthNames.map((month, idx) => (
                <option key={idx + 1} value={idx + 1}>{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white' }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Budget</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{user?.currency} {totalBudget.toFixed(2)}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Spent</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{user?.currency} {totalSpent.toFixed(2)}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Remaining</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{user?.currency} {(totalBudget - totalSpent).toFixed(2)}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Utilization</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366f1' }}>{utilization}%</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {categories.map(cat => {
            const budget = budgets?.find(b => b.category === cat);
            const budgetVal = budget ? parseFloat(budget.budget_amount) : 0;
            const actual = actualSpending[cat] || 0;
            const diff = budgetVal - actual;
            const isOver = diff < 0;
            const progress = budgetVal > 0 ? (actual / budgetVal) * 100 : 0;
            let barColor = '#10b981';
            if (isOver) barColor = '#ef4444';
            else if (progress > 80) barColor = '#eab308';

            return (
              <div key={cat} style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>{cat}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px' }}>Budget: {user?.currency} {budgetVal.toFixed(2)}</span>
                    <span style={{ fontSize: '14px' }}>Actual: {user?.currency} {actual.toFixed(2)}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: isOver ? '#ef4444' : '#10b981' }}>
                      {diff >= 0 ? '+' : ''}{user?.currency} {Math.abs(diff).toFixed(2)}
                    </span>
                    {editingCategory === cat ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(e.target.value)}
                          style={{ width: '96px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                          autoFocus
                        />
                        <button
                          onClick={() => updateBudget.mutate({ category: cat, budget_amount: parseFloat(budgetAmount), month: selectedMonth, year: selectedYear })}
                          style={{ padding: '4px 8px', background: '#6366f1', color: 'white', borderRadius: '4px', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingCategory(null); setBudgetAmount(''); }}
                          style={{ padding: '4px 8px', background: '#9ca3af', color: 'white', borderRadius: '4px', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingCategory(cat); setBudgetAmount(budgetVal); }}
                        style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <PencilIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                  <div style={{ width: Math.min(progress, 100) + '%', background: barColor, borderRadius: '9999px', height: '8px' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {progress.toFixed(1)}% used
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
