import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BellAlertIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { format, addMonths, addYears, addQuarters } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SubscriptionTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    service_name: '',
    cost: '',
    billing_cycle: 'Monthly',
    next_payment_date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Subscriptions',
    auto_pay: true,
    notes: ''
  });

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery('subscriptions', () =>
    api.get('/subscriptions').then(res => res.data)
  );

  // Fetch upcoming payments
  const { data: upcoming } = useQuery('upcoming-subscriptions', () =>
    api.get('/subscriptions/upcoming', { params: { days: 30 } }).then(res => res.data)
  );

  // Add subscription mutation
  const addMutation = useMutation(
    (data) => api.post('/subscriptions', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        queryClient.invalidateQueries('upcoming-subscriptions');
        toast.success('Subscription added');
        setShowForm(false);
        resetForm();
      },
      onError: () => toast.error('Failed to add subscription')
    }
  );

  // Update subscription mutation
  const updateMutation = useMutation(
    (data) => api.put('/subscriptions/' + editingSubscription.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        queryClient.invalidateQueries('upcoming-subscriptions');
        toast.success('Subscription updated');
        setShowForm(false);
        setEditingSubscription(null);
        resetForm();
      },
      onError: () => toast.error('Failed to update subscription')
    }
  );

  // Delete subscription mutation
  const deleteMutation = useMutation(
    (id) => api.delete('/subscriptions/' + id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        queryClient.invalidateQueries('upcoming-subscriptions');
        toast.success('Subscription deleted');
      },
      onError: () => toast.error('Failed to delete subscription')
    }
  );

  const resetForm = () => {
    setFormData({
      service_name: '',
      cost: '',
      billing_cycle: 'Monthly',
      next_payment_date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Subscriptions',
      auto_pay: true,
      notes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubscription) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (sub) => {
    setEditingSubscription(sub);
    setFormData({
      service_name: sub.service_name,
      cost: sub.cost,
      billing_cycle: sub.billing_cycle,
      next_payment_date: sub.next_payment_date,
      category: sub.category,
      auto_pay: sub.auto_pay,
      notes: sub.notes || ''
    });
    setShowForm(true);
  };

  const calculateNextPayment = (date, cycle) => {
    const nextDate = new Date(date);
    switch(cycle) {
      case 'Monthly':
        return addMonths(nextDate, 1);
      case 'Quarterly':
        return addQuarters(nextDate, 1);
      case 'Yearly':
        return addYears(nextDate, 1);
      default:
        return nextDate;
    }
  };

  const totalMonthly = subscriptions?.reduce((sum, sub) => {
    if (sub.billing_cycle === 'Monthly') return sum + parseFloat(sub.cost);
    if (sub.billing_cycle === 'Quarterly') return sum + (parseFloat(sub.cost) / 3);
    if (sub.billing_cycle === 'Yearly') return sum + (parseFloat(sub.cost) / 12);
    return sum;
  }, 0) || 0;

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Subscription Tracker</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Manage all your recurring payments in one place
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Subscription
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Total Subscriptions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{subscriptions?.length || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Monthly Total</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{user?.currency} {totalMonthly.toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Yearly Total</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{user?.currency} {(totalMonthly * 12).toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Due in 30 Days</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{upcoming?.length || 0}</p>
          </div>
        </div>

        {/* Upcoming Payments */}
        {upcoming?.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">⚠️ Upcoming Payments (Next 30 Days)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((sub) => (
                <div key={sub.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{sub.service_name}</span>
                    <span className="text-sm">{format(new Date(sub.next_payment_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{user?.currency} {parseFloat(sub.cost).toFixed(2)}</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">{sub.billing_cycle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Subscriptions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auto Pay
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions?.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <CreditCardIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sub.service_name}</div>
                          <div className="text-sm text-gray-500">{sub.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user?.currency} {parseFloat(sub.cost).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {sub.billing_cycle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(sub.next_payment_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sub.auto_pay ? (
                        <span className="text-green-600 font-medium">Enabled</span>
                      ) : (
                        <span className="text-gray-400">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this subscription?')) {
                            deleteMutation.mutate(sub.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    value={formData.service_name}
                    onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Netflix, Spotify"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                  <select
                    value={formData.billing_cycle}
                    onChange={(e) => setFormData({...formData, billing_cycle: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
                  <input
                    type="date"
                    value={formData.next_payment_date}
                    onChange={(e) => setFormData({...formData, next_payment_date: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Software">Software</option>
                    <option value="Membership">Membership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.auto_pay}
                    onChange={(e) => setFormData({...formData, auto_pay: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Auto-pay enabled
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    {editingSubscription ? 'Update' : 'Add'} Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSubscription(null);
                      resetForm();
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
