import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, PencilIcon, TrashIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function NetWorthTracker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [editingLiability, setEditingLiability] = useState(null);
  const [assetForm, setAssetForm] = useState({ name: '', type: 'Cash', value: '', location: '', condition: 'Good', notes: '' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active', notes: '' });

  const { data: assets = [], isLoading: assetsLoading } = useQuery('assets', async () => {
    try {
      const response = await api.get('/networth/assets');
      return response.data || [];
    } catch (err) { return []; }
  });

  const { data: liabilities = [], isLoading: liabilitiesLoading } = useQuery('liabilities', async () => {
    try {
      const response = await api.get('/networth/liabilities');
      return response.data || [];
    } catch (err) { return []; }
  });

  const addAsset = useMutation(async (data) => {
    const response = await api.post('/networth/assets', data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets');
      toast.success('Asset added successfully!');
      setShowAssetForm(false);
      setAssetForm({ name: '', type: 'Cash', value: '', location: '', condition: 'Good', notes: '' });
    },
    onError: () => toast.error('Failed to add asset')
  });

  const updateAsset = useMutation(async ({ id, data }) => {
    const response = await api.put('/networth/assets/' + id, data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets');
      toast.success('Asset updated successfully!');
      setEditingAsset(null);
      setShowAssetForm(false);
    },
    onError: () => toast.error('Failed to update asset')
  });

  const deleteAsset = useMutation(async (id) => {
    await api.delete('/networth/assets/' + id);
    return id;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets');
      toast.success('Asset deleted');
    },
    onError: () => toast.error('Failed to delete asset')
  });

  const addLiability = useMutation(async (data) => {
    const response = await api.post('/networth/liabilities', data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('liabilities');
      toast.success('Liability added successfully!');
      setShowLiabilityForm(false);
      setLiabilityForm({ name: '', type: 'Loan', amount: '', interestRate: '', dueDate: '', status: 'Active', notes: '' });
    },
    onError: () => toast.error('Failed to add liability')
  });

  const updateLiability = useMutation(async ({ id, data }) => {
    const response = await api.put('/networth/liabilities/' + id, data);
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('liabilities');
      toast.success('Liability updated successfully!');
      setEditingLiability(null);
      setShowLiabilityForm(false);
    },
    onError: () => toast.error('Failed to update liability')
  });

  const deleteLiability = useMutation(async (id) => {
    await api.delete('/networth/liabilities/' + id);
    return id;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('liabilities');
      toast.success('Liability deleted');
    },
    onError: () => toast.error('Failed to delete liability')
  });

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      type: asset.type,
      value: asset.value,
      location: asset.location || '',
      condition: asset.condition || 'Good',
      notes: asset.notes || ''
    });
    setShowAssetForm(true);
  };

  const handleEditLiability = (liability) => {
    setEditingLiability(liability);
    setLiabilityForm({
      name: liability.name,
      type: liability.type,
      amount: liability.amount,
      interestRate: liability.interest_rate || '',
      dueDate: liability.due_date || '',
      status: liability.status || 'Active',
      notes: liability.notes || ''
    });
    setShowLiabilityForm(true);
  };

  const handleAssetSubmit = (e) => {
    e.preventDefault();
    if (editingAsset) {
      updateAsset.mutate({ id: editingAsset.id, data: assetForm });
    } else {
      addAsset.mutate(assetForm);
    }
  };

  const handleLiabilitySubmit = (e) => {
    e.preventDefault();
    if (editingLiability) {
      updateLiability.mutate({ id: editingLiability.id, data: liabilityForm });
    } else {
      addLiability.mutate(liabilityForm);
    }
  };

  const totalAssets = assets.reduce((sum, a) => sum + parseFloat(a.value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  if (assetsLoading || liabilitiesLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Net Worth Tracker</h1><p className="text-gray-600 dark:text-gray-400">Track your assets and liabilities</p></div>
          <div className="flex gap-3">
            <button onClick={() => { setEditingAsset(null); setShowAssetForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">+ Add Asset</button>
            <button onClick={() => { setEditingLiability(null); setShowLiabilityForm(true); }} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">+ Add Liability</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"><p className="text-sm">Total Assets</p><p className="text-3xl font-bold">{user?.currency} {totalAssets.toLocaleString()}</p></div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white"><p className="text-sm">Total Liabilities</p><p className="text-3xl font-bold">{user?.currency} {totalLiabilities.toLocaleString()}</p></div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white"><p className="text-sm">Net Worth</p><p className="text-3xl font-bold">{user?.currency} {currentNetWorth.toLocaleString()}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-4 bg-green-600 text-white font-semibold">Assets</div>
            <div className="p-4 space-y-3">
              {assets.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No assets yet. Add your first asset!</p>
              ) : (
                assets.map(asset => (
                  <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div><p className="font-medium">{asset.name}</p><p className="text-sm text-gray-500">{asset.type} • {asset.location || 'No location'} • {asset.condition}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">{user?.currency} {parseFloat(asset.value).toLocaleString()}</span>
                      <button onClick={() => handleEditAsset(asset)} className="text-indigo-600"><PencilIcon className="h-5 w-5" /></button>
                      <button onClick={() => { if (window.confirm('Delete this asset?')) deleteAsset.mutate(asset.id); }} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-4 bg-red-600 text-white font-semibold">Liabilities</div>
            <div className="p-4 space-y-3">
              {liabilities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No liabilities yet. Add your first liability!</p>
              ) : (
                liabilities.map(liability => (
                  <div key={liability.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div><p className="font-medium">{liability.name}</p><p className="text-sm text-gray-500">{liability.type} • {liability.interest_rate}% • Due: {liability.due_date} • {liability.status}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-red-600">{user?.currency} {parseFloat(liability.amount).toLocaleString()}</span>
                      <button onClick={() => handleEditLiability(liability)} className="text-indigo-600"><PencilIcon className="h-5 w-5" /></button>
                      <button onClick={() => { if (window.confirm('Delete this liability?')) deleteLiability.mutate(liability.id); }} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingAsset ? 'Edit Asset' : 'Add Asset'}</h2>
            <form onSubmit={handleAssetSubmit}>
              <input type="text" placeholder="Name" value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={assetForm.type} onChange={(e) => setAssetForm({...assetForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Cash</option><option>Investment</option><option>Real Estate</option><option>Vehicle</option><option>Digital Assets</option><option>Equipment</option></select>
              <input type="number" placeholder="Value" value={assetForm.value} onChange={(e) => setAssetForm({...assetForm, value: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="text" placeholder="Location" value={assetForm.location} onChange={(e) => setAssetForm({...assetForm, location: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <select value={assetForm.condition} onChange={(e) => setAssetForm({...assetForm, condition: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option></select>
              <textarea placeholder="Notes" value={assetForm.notes} onChange={(e) => setAssetForm({...assetForm, notes: e.target.value})} rows="2" className="w-full p-2 mb-3 border rounded-lg" />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg">Save</button><button type="button" onClick={() => { setShowAssetForm(false); setEditingAsset(null); }} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Liability Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingLiability ? 'Edit Liability' : 'Add Liability'}</h2>
            <form onSubmit={handleLiabilitySubmit}>
              <input type="text" placeholder="Name" value={liabilityForm.name} onChange={(e) => setLiabilityForm({...liabilityForm, name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <select value={liabilityForm.type} onChange={(e) => setLiabilityForm({...liabilityForm, type: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Loan</option><option>Mortgage</option><option>Credit Card</option><option>Student Loan</option><option>Car Loan</option></select>
              <input type="number" placeholder="Amount" value={liabilityForm.amount} onChange={(e) => setLiabilityForm({...liabilityForm, amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" placeholder="Interest Rate %" value={liabilityForm.interestRate} onChange={(e) => setLiabilityForm({...liabilityForm, interestRate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <input type="date" placeholder="Due Date" value={liabilityForm.dueDate} onChange={(e) => setLiabilityForm({...liabilityForm, dueDate: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <select value={liabilityForm.status} onChange={(e) => setLiabilityForm({...liabilityForm, status: e.target.value})} className="w-full p-2 mb-3 border rounded-lg"><option>Active</option><option>Pending</option><option>Paid</option><option>Overdue</option></select>
              <textarea placeholder="Notes" value={liabilityForm.notes} onChange={(e) => setLiabilityForm({...liabilityForm, notes: e.target.value})} rows="2" className="w-full p-2 mb-3 border rounded-lg" />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg">Save</button><button type="button" onClick={() => { setShowLiabilityForm(false); setEditingLiability(null); }} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
