import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, parseISO } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const expenseCategories = ['Housing', 'Food', 'Transport', 'Utilities', 'Insurance', 'Debt', 'Entertainment', 'Shopping', 'Health', 'Subscriptions'];
const expenseTypes = ['Fixed', 'Variable'];

export default function ExpenseTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({ date: format(new Date(), 'yyyy-MM-dd'), name: '', category: '', type: 'Variable', amount: '', description: '' });

  const { data: expenses = [], isLoading } = useQuery(['expenses', selectedMonth, selectedYear], async () => {
    try {
      const response = await api.get('/expenses', { params: { month: selectedMonth, year: selectedYear } });
      return response.data || [];
    } catch (err) {
      return [];
    }
  });

  const addMutation = useMutation(async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', selectedMonth, selectedYear]);
      toast.success('Expense added successfully!');
      setShowForm(false);
      resetForm();
    },
    onError: () => toast.error('Failed to add expense')
  });

  const updateMutation = useMutation(async ({ id, data }) => {
    const response = await api.put(/expenses/, data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', selectedMonth, selectedYear]);
      toast.success('Expense updated successfully!');
      setShowForm(false);
      setEditingExpense(null);
    },
    onError: () => toast.error('Failed to update expense')
  });

  const deleteMutation = useMutation(async (id) => {
    await api.delete(/expenses/);
    return id;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses', selectedMonth, selectedYear]);
      toast.success('Expense deleted successfully!');
    },
    onError: () => toast.error('Failed to delete expense')
  });

  const resetForm = () => {
    setFormData({ date: format(new Date(), 'yyyy-MM-dd'), name: '', category: '', type: 'Variable', amount: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingExpense(item);
    setFormData({
      date: format(parseISO(item.date), 'yyyy-MM-dd'),
      name: item.name,
      category: item.category,
      type: item.type,
      amount: item.amount,
      description: item.description || ''
    });
    setShowForm(true);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getTypeClass = (type) => {
    if (type === 'Fixed') {
      return 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
    }
    return 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your spending habits</p>
          </div>
          <div className="flex gap-3">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="p-2 border rounded-lg dark:bg-gray-800">
              {monthNames.map((month, idx) => (<option key={idx + 1} value={idx + 1}>{month}</option>))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="p-2 border rounded-lg dark:bg-gray-800">
              <option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option>
            </select>
            <button onClick={() => { setEditingExpense(null); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              + Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Monthly Expenses</p>
            <p className="text-2xl font-bold text-red-600">{user?.currency} {totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fixed Expenses</p>
            <p className="text-2xl font-bold text-blue-600">{user?.currency} {expenses.filter(e => e.type === 'Fixed').reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Variable Expenses</p>
            <p className="text-2xl font-bold text-yellow-600">{user?.currency} {expenses.filter(e => e.type === 'Variable').reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Transactions</p>
            <p className="text-2xl font-bold text-indigo-600">{expenses.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                 </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No expenses yet. Add your first expense!
                    </td>
                  </tr>
                ) : (
                  expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {format(parseISO(item.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getTypeClass(item.type)}>{item.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                        {user?.currency} {parseFloat(item.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(item)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => { if (window.confirm('Delete this expense?')) deleteMutation.mutate(item.id); }} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" placeholder="e.g., Groceries, Rent" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                  <option value="">Select category</option>
                  {expenseCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                  {expenseTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <input type="number" step="0.01" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="Add notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingExpense(null); resetForm(); }} className="flex-1 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-400 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
