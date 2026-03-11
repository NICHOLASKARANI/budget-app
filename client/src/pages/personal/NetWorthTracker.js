import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  BanknotesIcon,
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function NetWorthTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [assetForm, setAssetForm] = useState({ name: '', type: '', value: '', notes: '' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', type: '', amount: '', interestRate: '', notes: '' });

  // Fetch net worth data
  const { data: netWorth, isLoading } = useQuery('networth', () => 
    api.get('/networth').then(res => res.data)
  );

  // Fetch assets
  const { data: assets } = useQuery('assets', () => 
    api.get('/networth/assets').then(res => res.data)
  );

  // Fetch liabilities
  const { data: liabilities } = useQuery('liabilities', () => 
    api.get('/networth/liabilities').then(res => res.data)
  );

  // Add asset mutation
  const addAssetMutation = useMutation(
    (data) => api.post('/networth/assets', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        queryClient.invalidateQueries('networth');
        toast.success('Asset added successfully');
        setShowAssetForm(false);
        setAssetForm({ name: '', type: '', value: '', notes: '' });
      },
      onError: () => toast.error('Failed to add asset')
    }
  );

  // Add liability mutation
  const addLiabilityMutation = useMutation(
    (data) => api.post('/networth/liabilities', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('liabilities');
        queryClient.invalidateQueries('networth');
        toast.success('Liability added successfully');
        setShowLiabilityForm(false);
        setLiabilityForm({ name: '', type: '', amount: '', interestRate: '', notes: '' });
      },
      onError: () => toast.error('Failed to add liability')
    }
  );

  // Delete asset mutation
  const deleteAssetMutation = useMutation(
    (id) => api.delete(/networth/assets/),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        queryClient.invalidateQueries('networth');
        toast.success('Asset deleted');
      },
      onError: () => toast.error('Failed to delete asset')
    }
  );

  // Delete liability mutation
  const deleteLiabilityMutation = useMutation(
    (id) => api.delete(/networth/liabilities/),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('liabilities');
        queryClient.invalidateQueries('networth');
        toast.success('Liability deleted');
      },
      onError: () => toast.error('Failed to delete liability')
    }
  );

  const totalAssets = assets?.reduce((sum, a) => sum + parseFloat(a.value), 0) || 0;
  const totalLiabilities = liabilities?.reduce((sum, l) => sum + parseFloat(l.amount), 0) || 0;
  const currentNetWorth = totalAssets - totalLiabilities;

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Net Worth Tracker</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Track your assets and liabilities over time
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => setShowAssetForm(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Asset
            </button>
            <button
              onClick={() => setShowLiabilityForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Liability
            </button>
          </div>
        </div>

        {/* Net Worth Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-green-100">Total Assets</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {totalAssets.toLocaleString()}</p>
            <p className="text-sm text-green-100 mt-2">+12.3% this month</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-red-100">Total Liabilities</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {totalLiabilities.toLocaleString()}</p>
            <p className="text-sm text-red-100 mt-2">-3.2% this month</p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-indigo-100">Net Worth</p>
            <p className="text-3xl font-bold mt-2">{user?.currency} {currentNetWorth.toLocaleString()}</p>
            <p className="text-sm text-indigo-100 mt-2">
              {totalAssets > 0 ? ((currentNetWorth / totalAssets) * 100).toFixed(1) : '0'}% of assets
            </p>
          </div>
        </div>

        {/* Net Worth Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Worth Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorth || []}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="net_worth" stroke="#4f46e5" fill="url(#netWorthGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets and Liabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Assets */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-green-600 to-emerald-600">
              <h3 className="text-lg font-semibold text-white">Assets</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assets?.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <HomeIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-green-600">
                        {user?.currency} {parseFloat(asset.value).toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteAssetMutation.mutate(asset.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Liabilities */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-pink-600">
              <h3 className="text-lg font-semibold text-white">Liabilities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {liabilities?.map((liability) => (
                  <div key={liability.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <CreditCardIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{liability.name}</p>
                        <p className="text-sm text-gray-500">{liability.type} · {liability.interestRate}% APR</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-red-600">
                        {user?.currency} {parseFloat(liability.amount).toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteLiabilityMutation.mutate(liability.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Asset</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addAssetMutation.mutate(assetForm);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={assetForm.type}
                    onChange={(e) => setAssetForm({...assetForm, type: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Cash">Cash</option>
                    <option value="Investment">Investment</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={assetForm.value}
                    onChange={(e) => setAssetForm({...assetForm, value: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={assetForm.notes}
                    onChange={(e) => setAssetForm({...assetForm, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Add Asset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssetForm(false)}
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

      {/* Add Liability Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Liability</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addLiabilityMutation.mutate(liabilityForm);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={liabilityForm.name}
                    onChange={(e) => setLiabilityForm({...liabilityForm, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={liabilityForm.type}
                    onChange={(e) => setLiabilityForm({...liabilityForm, type: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Loan">Loan</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Student Loan">Student Loan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={liabilityForm.amount}
                    onChange={(e) => setLiabilityForm({...liabilityForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={liabilityForm.interestRate}
                    onChange={(e) => setLiabilityForm({...liabilityForm, interestRate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={liabilityForm.notes}
                    onChange={(e) => setLiabilityForm({...liabilityForm, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Add Liability
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLiabilityForm(false)}
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
