import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, TrashIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SubscriptionTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ service_name: '', cost: '', billing_cycle: 'Monthly', next_payment_date: format(new Date(), 'yyyy-MM-dd'), category: 'Subscriptions' });

  const { data: subscriptions } = useQuery('subscriptions', () => api.get('/subscriptions').catch(() => []));

  const addMutation = useMutation(
    (data) => api.post('/subscriptions', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        toast.success('✅ Subscription added successfully!');
        setShowForm(false);
        setFormData({ service_name: '', cost: '', billing_cycle: 'Monthly', next_payment_date: format(new Date(), 'yyyy-MM-dd'), category: 'Subscriptions' });
      },
      onError: (error) => toast.error('Failed to add subscription: ' + (error.response?.data?.error || error.message))
    }
  );

  const deleteSubscription = (id) => {
    if (window.confirm('Delete this subscription?')) {
      api.delete('/subscriptions/' + id).then(() => {
        queryClient.invalidateQueries('subscriptions');
        toast.success('Subscription deleted');
      }).catch(() => toast.error('Failed to delete'));
    }
  };

  const totalMonthly = subscriptions?.reduce((sum, sub) => {
    if (sub.billing_cycle === 'Monthly') return sum + parseFloat(sub.cost);
    if (sub.billing_cycle === 'Quarterly') return sum + (parseFloat(sub.cost) / 3);
    if (sub.billing_cycle === 'Yearly') return sum + (parseFloat(sub.cost) / 12);
    return sum;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Tracker</h1><p className="text-gray-600 dark:text-gray-400">Manage your recurring payments</p></div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">+ Add Subscription</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Subscriptions</p><p className="text-3xl font-bold">{subscriptions?.length || 0}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Monthly Total</p><p className="text-3xl font-bold text-indigo-600">{user?.currency} {totalMonthly.toFixed(2)}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Yearly Total</p><p className="text-3xl font-bold text-purple-600">{user?.currency} {(totalMonthly * 12).toFixed(2)}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Due in 30 Days</p><p className="text-3xl font-bold text-orange-600">{subscriptions?.filter(s => new Date(s.next_payment_date) < new Date(Date.now() + 30*24*60*60*1000)).length || 0}</p></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900"><tr><th className="p-3 text-left">Service</th><th className="p-3 text-left">Cost</th><th className="p-3 text-left">Cycle</th><th className="p-3 text-left">Next Payment</th><th className="p-3 text-left">Actions</th></tr></thead>
            <tbody>{subscriptions?.map(sub => (<tr key={sub.id} className="border-t"><td className="p-3 flex items-center gap-2"><CreditCardIcon className="h-5 w-5 text-indigo-600" />{sub.service_name}</td><td className="p-3">{user?.currency} {parseFloat(sub.cost).toFixed(2)}</td><td className="p-3"><span className="px-2 py-1 bg-indigo-100 rounded-full text-sm">{sub.billing_cycle}</span></td><td className="p-3">{format(new Date(sub.next_payment_date), 'MMM dd, yyyy')}</td><td className="p-3"><button onClick={() => deleteSubscription(sub.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button></td></tr>))}</tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Subscription</h2>
            <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(formData); }}>
              <input type="text" placeholder="Service Name" value={formData.service_name} onChange={(e) => setFormData({...formData, service_name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" step="0.01" placeholder="Cost" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={formData.billing_cycle} onChange={(e) => setFormData({...formData, billing_cycle: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Monthly</option><option>Quarterly</option><option>Yearly</option></select>
              <input type="date" value={formData.next_payment_date} onChange={(e) => setFormData({...formData, next_payment_date: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
