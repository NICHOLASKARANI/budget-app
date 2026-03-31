import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, parseISO } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investments', 'Digital Income', 'Rental Income', 'Interest Income', 'Gifts', 'Bonus Income', 'Side Hustle'];
const paymentMethods = ['Bank Transfer', 'PayPal', 'Cash', 'Check', 'Cryptocurrency'];

export default function IncomeTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({ date: format(new Date(), 'yyyy-MM-dd'), source: '', category: '', amount: '', description: '', payment_method: 'Bank Transfer', location: '' });

  const { data: income = [], isLoading } = useQuery(['income', selectedMonth, selectedYear], async () => {
    try {
      const response = await api.get('/income', { params: { month: selectedMonth, year: selectedYear } });
      return response.data || [];
    } catch (err) { return []; }
  });

  const addMutation = useMutation(async (data) => { const response = await api.post('/income', data); return response.data; }, {
    onSuccess: () => { queryClient.invalidateQueries(['income', selectedMonth, selectedYear]); toast.success('Income added!'); setShowForm(false); resetForm(); },
    onError: () => toast.error('Failed to add')
  });

  const updateMutation = useMutation(async ({ id, data }) => { const response = await api.put(/income/, data); return response.data; }, {
    onSuccess: () => { queryClient.invalidateQueries(['income', selectedMonth, selectedYear]); toast.success('Income updated!'); setShowForm(false); setEditingIncome(null); },
    onError: () => toast.error('Failed to update')
  });

  const deleteMutation = useMutation(async (id) => { await api.delete(/income/); return id; }, {
    onSuccess: () => { queryClient.invalidateQueries(['income', selectedMonth, selectedYear]); toast.success('Income deleted'); },
    onError: () => toast.error('Failed to delete')
  });

  const resetForm = () => setFormData({ date: format(new Date(), 'yyyy-MM-dd'), source: '', category: '', amount: '', description: '', payment_method: 'Bank Transfer', location: '' });
  const handleSubmit = (e) => { e.preventDefault(); editingIncome ? updateMutation.mutate({ id: editingIncome.id, data: formData }) : addMutation.mutate(formData); };
  const handleEdit = (item) => { setEditingIncome(item); setFormData({ date: format(parseISO(item.date), 'yyyy-MM-dd'), source: item.source, category: item.category, amount: item.amount, description: item.description || '', payment_method: item.payment_method || 'Bank Transfer', location: item.location || '' }); setShowForm(true); };

  const totalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6"><div><h1 className="text-3xl font-bold">Income Tracker</h1><p className="text-gray-600">Track your earnings</p></div><button onClick={() => { setEditingIncome(null); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">+ Add Income</button></div>
        <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-white p-6 rounded-2xl shadow"><p className="text-gray-500">Monthly Income</p><p className="text-2xl font-bold">{user?.currency} {totalIncome.toFixed(2)}</p></div></div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Source</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Method</th><th className="p-3 text-left">Actions</th></tr></thead>
            <tbody>{income.length === 0 ? <tr><td colSpan="6" className="p-4 text-center text-gray-500">No income entries yet. Add your first income!</td></tr> : income.map(item => (<tr key={item.id} className="border-t"><td className="p-3">{format(parseISO(item.date), 'MMM dd, yyyy')}</td><td className="p-3">{item.source}</td><td className="p-3 text-gray-500">{item.category}</td><td className="p-3 text-green-600 font-medium">{user?.currency} {parseFloat(item.amount).toFixed(2)}</td><td className="p-3"><span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{item.payment_method}</span></td><td className="p-3"><button onClick={() => handleEdit(item)} className="text-indigo-600 mr-2"><PencilIcon className="h-5 w-5" /></button><button onClick={() => { if (window.confirm('Delete this income?')) deleteMutation.mutate(item.id); }} className="text-red-500"><TrashIcon className="h-5 w-5" /></button></td></tr>))}</tbody></table>
          </div>
        </div>
      </div>
      {showForm && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-md w-full p-6"><h2 className="text-xl font-bold mb-4">{editingIncome ? 'Edit Income' : 'Add Income'}</h2><form onSubmit={handleSubmit}><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required /><input type="text" placeholder="Source" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required /><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required><option value="">Select category</option>{incomeCategories.map(c => <option key={c} value={c}>{c}</option>)}</select><input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required /><select value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})} className="w-full p-2 mb-3 border rounded-lg">{paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}</select><textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full p-2 mb-3 border rounded-lg" /><div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button><button type="button" onClick={() => { setShowForm(false); setEditingIncome(null); }} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div></form></div></div>)}
    </div>
  );
}
