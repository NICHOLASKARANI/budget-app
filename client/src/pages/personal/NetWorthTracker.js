import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, TrashIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function NetWorthTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', type: 'Cash', value: '', location: '', condition: 'Good', notes: '' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active', notes: '' });

  const { data: netWorth } = useQuery('networth', () => api.get('/networth').catch(() => []));
  const { data: assets, refetch: refetchAssets } = useQuery('assets', () => api.get('/networth/assets').catch(() => []));
  const { data: liabilities, refetch: refetchLiabilities } = useQuery('liabilities', () => api.get('/networth/liabilities').catch(() => []));

  const addAssetMutation = useMutation(
    (data) => api.post('/networth/assets', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        queryClient.invalidateQueries('networth');
        toast.success('✅ Asset added successfully!');
        setShowAssetForm(false);
        setAssetForm({ name: '', type: 'Cash', value: '', location: '', condition: 'Good', notes: '' });
      },
      onError: (error) => toast.error('Failed to add asset: ' + (error.response?.data?.error || error.message))
    }
  );

  const addLiabilityMutation = useMutation(
    (data) => api.post('/networth/liabilities', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('liabilities');
        queryClient.invalidateQueries('networth');
        toast.success('✅ Liability added successfully!');
        setShowLiabilityForm(false);
        setLiabilityForm({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active', notes: '' });
      },
      onError: (error) => toast.error('Failed to add liability: ' + (error.response?.data?.error || error.message))
    }
  );

  const deleteAsset = (id) => {
    if (window.confirm('Delete this asset?')) {
      api.delete('/networth/assets/' + id).then(() => {
        queryClient.invalidateQueries('assets');
        queryClient.invalidateQueries('networth');
        toast.success('Asset deleted');
      }).catch(() => toast.error('Failed to delete'));
    }
  };

  const deleteLiability = (id) => {
    if (window.confirm('Delete this liability?')) {
      api.delete('/networth/liabilities/' + id).then(() => {
        queryClient.invalidateQueries('liabilities');
        queryClient.invalidateQueries('networth');
        toast.success('Liability deleted');
      }).catch(() => toast.error('Failed to delete'));
    }
  };

  const totalAssets = assets?.reduce((sum, a) => sum + parseFloat(a.value || 0), 0) || 0;
  const totalLiabilities = liabilities?.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0) || 0;
  const currentNetWorth = totalAssets - totalLiabilities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-green-600 text-white font-semibold">Assets</div>
            <div className="p-4 space-y-3">
              {assets?.map(asset => (
                <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div><p className="font-medium">{asset.name}</p><p className="text-sm text-gray-500">{asset.type} • {asset.location || 'No location'}</p></div>
                  <div className="flex items-center gap-3"><span className="font-bold text-green-600">{user?.currency} {parseFloat(asset.value).toLocaleString()}</span><button onClick={() => deleteAsset(asset.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-red-600 text-white font-semibold">Liabilities</div>
            <div className="p-4 space-y-3">
              {liabilities?.map(liability => (
                <div key={liability.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div><p className="font-medium">{liability.name}</p><p className="text-sm text-gray-500">{liability.type} • {liability.interestRate}% • Due: {liability.dueDate}</p></div>
                  <div className="flex items-center gap-3"><span className="font-bold text-red-600">{user?.currency} {parseFloat(liability.amount).toLocaleString()}</span><button onClick={() => deleteLiability(liability.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button></div>
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
            <form onSubmit={(e) => { e.preventDefault(); addAssetMutation.mutate(assetForm); }}>
              <input type="text" placeholder="Name" value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={assetForm.type} onChange={(e) => setAssetForm({...assetForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Cash</option><option>Investment</option><option>Real Estate</option><option>Vehicle</option><option>Other</option></select>
              <input type="number" placeholder="Value" value={assetForm.value} onChange={(e) => setAssetForm({...assetForm, value: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="text" placeholder="Location (e.g., Bank, Garage)" value={assetForm.location} onChange={(e) => setAssetForm({...assetForm, location: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <textarea placeholder="Notes" value={assetForm.notes} onChange={(e) => setAssetForm({...assetForm, notes: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" rows="2" />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg">Save</button><button type="button" onClick={() => setShowAssetForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Liability Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Liability</h2>
            <form onSubmit={(e) => { e.preventDefault(); addLiabilityMutation.mutate(liabilityForm); }}>
              <input type="text" placeholder="Name" value={liabilityForm.name} onChange={(e) => setLiabilityForm({...liabilityForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={liabilityForm.type} onChange={(e) => setLiabilityForm({...liabilityForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Loan</option><option>Mortgage</option><option>Credit Card</option><option>Student Loan</option><option>Other</option></select>
              <input type="number" placeholder="Amount" value={liabilityForm.amount} onChange={(e) => setLiabilityForm({...liabilityForm, amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" placeholder="Interest Rate (%)" value={liabilityForm.interestRate} onChange={(e) => setLiabilityForm({...liabilityForm, interestRate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <input type="date" placeholder="Due Date" value={liabilityForm.dueDate} onChange={(e) => setLiabilityForm({...liabilityForm, dueDate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <select value={liabilityForm.status} onChange={(e) => setLiabilityForm({...liabilityForm, status: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Active</option><option>Pending</option><option>Paid</option><option>Overdue</option></select>
              <textarea placeholder="Notes" value={liabilityForm.notes} onChange={(e) => setLiabilityForm({...liabilityForm, notes: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" rows="2" />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg">Save</button><button type="button" onClick={() => setShowLiabilityForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
