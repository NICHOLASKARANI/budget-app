import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { TrashIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function NetWorthTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', type: 'Cash', value: '', location: '', condition: 'Good' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active' });

  const { data: assets = [], isLoading: assetsLoading } = useQuery('assets', async () => {
    try {
      const response = await api.get('/networth/assets');
      return response.data || [];
    } catch (err) {
      return [];
    }
  });

  const { data: liabilities = [], isLoading: liabilitiesLoading } = useQuery('liabilities', async () => {
    try {
      const response = await api.get('/networth/liabilities');
      return response.data || [];
    } catch (err) {
      return [];
    }
  });

  const addAsset = useMutation(
    async (data) => {
      const response = await api.post('/networth/assets', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        toast.success('Asset added successfully!');
        setShowAssetForm(false);
        setAssetForm({ name: '', type: 'Cash', value: '', location: '', condition: 'Good' });
      },
      onError: () => toast.error('Failed to add asset')
    }
  );

  const addLiability = useMutation(
    async (data) => {
      const response = await api.post('/networth/liabilities', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('liabilities');
        toast.success('Liability added successfully!');
        setShowLiabilityForm(false);
        setLiabilityForm({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active' });
      },
      onError: () => toast.error('Failed to add liability')
    }
  );

  const deleteAsset = useMutation(
    async (id) => {
      await api.delete('/networth/assets/' + id);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        toast.success('Asset deleted');
      },
      onError: () => toast.error('Failed to delete asset')
    }
  );

  const deleteLiability = useMutation(
    async (id) => {
      await api.delete('/networth/liabilities/' + id);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('liabilities');
        toast.success('Liability deleted');
      },
      onError: () => toast.error('Failed to delete liability')
    }
  );

  const totalAssets = assets.reduce((sum, a) => sum + parseFloat(a.value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  if (assetsLoading || liabilitiesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Net Worth Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your assets and liabilities</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAssetForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">+ Add Asset</button>
            <button onClick={() => setShowLiabilityForm(true)} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">+ Add Liability</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-sm">Total Assets</p>
            <p className="text-3xl font-bold">{user?.currency} {totalAssets.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <p className="text-sm">Total Liabilities</p>
            <p className="text-3xl font-bold">{user?.currency} {totalLiabilities.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
            <p className="text-sm">Net Worth</p>
            <p className="text-3xl font-bold">{user?.currency} {currentNetWorth.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-4 bg-green-600 text-white font-semibold">Assets</div>
            <div className="p-4 space-y-3">
              {assets.map(asset => (
                <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.type} • {asset.location || 'No location'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">{user?.currency} {parseFloat(asset.value).toLocaleString()}</span>
                    <button onClick={() => deleteAsset.mutate(asset.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-4 bg-red-600 text-white font-semibold">Liabilities</div>
            <div className="p-4 space-y-3">
              {liabilities.map(liability => (
                <div key={liability.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <p className="font-medium">{liability.name}</p>
                    <p className="text-sm text-gray-500">{liability.type} • {liability.interestRate}% • Due: {liability.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">{user?.currency} {parseFloat(liability.amount).toLocaleString()}</span>
                    <button onClick={() => deleteLiability.mutate(liability.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Asset</h2>
            <form onSubmit={(e) => { e.preventDefault(); addAsset.mutate(assetForm); }}>
              <input type="text" placeholder="Name" value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={assetForm.type} onChange={(e) => setAssetForm({...assetForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg">
                <option>Cash</option><option>Investment</option><option>Real Estate</option><option>Vehicle</option>
              </select>
              <input type="number" placeholder="Value" value={assetForm.value} onChange={(e) => setAssetForm({...assetForm, value: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="text" placeholder="Location" value={assetForm.location} onChange={(e) => setAssetForm({...assetForm, location: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setShowAssetForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liability Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Liability</h2>
            <form onSubmit={(e) => { e.preventDefault(); addLiability.mutate(liabilityForm); }}>
              <input type="text" placeholder="Name" value={liabilityForm.name} onChange={(e) => setLiabilityForm({...liabilityForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={liabilityForm.type} onChange={(e) => setLiabilityForm({...liabilityForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg">
                <option>Loan</option><option>Mortgage</option><option>Credit Card</option>
              </select>
              <input type="number" placeholder="Amount" value={liabilityForm.amount} onChange={(e) => setLiabilityForm({...liabilityForm, amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" placeholder="Interest Rate %" value={liabilityForm.interestRate} onChange={(e) => setLiabilityForm({...liabilityForm, interestRate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <input type="date" placeholder="Due Date" value={liabilityForm.dueDate} onChange={(e) => setLiabilityForm({...liabilityForm, dueDate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setShowLiabilityForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
