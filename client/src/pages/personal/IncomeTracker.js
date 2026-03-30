import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, parseISO } from 'date-fns';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const incomeCategories = [
  'Salary', 'Freelance', 'Business', 'Investments', 'Digital Income',
  'Rental Income', 'Interest Income', 'Gifts', 'Bonus Income', 'Side Hustle',
  'Dividends', 'Rental Property', 'Car Rental', 'House Rent', 'Other'
];

const paymentMethods = [
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'crypto', label: 'Cryptocurrency' }
];

export default function IncomeTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    source: '',
    category: '',
    amount: '',
    description: '',
    payment_method: 'bank',
    location: ''
  });

  // Fetch income data
  const { data: income = [], isLoading, error } = useQuery(
    ['income', selectedMonth, selectedYear],
    async () => {
      try {
        const response = await api.get('/income', { params: { month: selectedMonth, year: selectedYear } });
        return response.data || [];
      } catch (err) {
        console.error('Error fetching income:', err);
        return [];
      }
    }
  );

  // Fetch summary
  const { data: summary = [] } = useQuery(
    ['income-summary', selectedYear],
    async () => {
      try {
        const response = await api.get('/income/summary', { params: { year: selectedYear } });
        return response.data || [];
      } catch (err) {
        return [];
      }
    }
  );

  // Add income mutation
  const addMutation = useMutation(
    async (data) => {
      const response = await api.post('/income', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['income', selectedMonth, selectedYear]);
        queryClient.invalidateQueries(['income-summary', selectedYear]);
        toast.success('Income added successfully!');
        setShowForm(false);
        resetForm();
      },
      onError: () => toast.error('Failed to add income')
    }
  );

  // Update income mutation
  const updateMutation = useMutation(
    async (data) => {
      const response = await api.put(/income/, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['income', selectedMonth, selectedYear]);
        queryClient.invalidateQueries(['income-summary', selectedYear]);
        toast.success('Income updated successfully!');
        setShowForm(false);
        setEditingIncome(null);
        resetForm();
      },
      onError: () => toast.error('Failed to update income')
    }
  );

  // Delete income mutation
  const deleteMutation = useMutation(
    async (id) => {
      await api.delete(/income/);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['income', selectedMonth, selectedYear]);
        queryClient.invalidateQueries(['income-summary', selectedYear]);
        toast.success('Income deleted successfully!');
      },
      onError: () => toast.error('Failed to delete income')
    }
  );

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      source: '',
      category: '',
      amount: '',
      description: '',
      payment_method: 'bank',
      location: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIncome) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingIncome(item);
    setFormData({
      date: format(parseISO(item.date), 'yyyy-MM-dd'),
      source: item.source,
      category: item.category,
      amount: item.amount,
      description: item.description || '',
      payment_method: item.payment_method || 'bank',
      location: item.location || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      deleteMutation.mutate(id);
    }
  };

  const totalIncome = income?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading income data. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Income Tracker</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Track and manage all your income sources</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Income
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.currency} {totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Annual Income</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.currency} {summary?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {format(new Date(2000, month - 1, 1), 'MMMM')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="mt-1 block w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Income Entries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-xs text-gray-500">Date</th>
                  <th className="p-3 text-left text-xs text-gray-500">Source</th>
                  <th className="p-3 text-left text-xs text-gray-500">Category</th>
                  <th className="p-3 text-left text-xs text-gray-500">Amount</th>
                  <th className="p-3 text-left text-xs text-gray-500">Method</th>
                  <th className="p-3 text-right text-xs text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {income?.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-gray-500">No income entries yet. Add your first income!</td></tr>
                ) : (
                  income?.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">{format(parseISO(item.date), 'MMM dd, yyyy')}</td>
                      <td className="p-3">{item.source}</td>
                      <td className="p-3 text-gray-500">{item.category}</td>
                      <td className="p-3 text-green-600 font-medium">{user?.currency} {parseFloat(item.amount).toFixed(2)}</td>
                      <td className="p-3"><span className="px-2 py-1 text-xs bg-gray-100 rounded-full">{item.payment_method}</span></td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleEdit(item)} className="text-indigo-600 mr-2"><PencilIcon className="h-5 w-5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button>
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
            <h2 className="text-xl font-bold mb-4">{editingIncome ? 'Edit Income' : 'Add New Income'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
              <div><label className="block text-sm">Source</label><input type="text" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="e.g., Monthly Salary" required /></div>
              <div><label className="block text-sm">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg" required><option value="">Select category</option>{incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              <div><label className="block text-sm">Amount</label><input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
              <div><label className="block text-sm">Payment Method</label><select value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})} className="w-full p-2 border rounded-lg">{paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
              <div><label className="block text-sm">Description (Optional)</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full p-2 border rounded-lg" /></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button><button type="button" onClick={() => { setShowForm(false); setEditingIncome(null); resetForm(); }} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
