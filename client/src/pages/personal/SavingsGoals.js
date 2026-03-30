import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, TrashIcon, FlagIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SavingsGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ goal_name: '', target_amount: '', saved_amount: '', target_date: format(new Date(), 'yyyy-MM-dd') });

  const { data: goals, refetch } = useQuery('goals', () => api.get('/goals').catch(() => []));

  const addMutation = useMutation(
    (data) => api.post('/goals', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        toast.success('✅ Goal created successfully!');
        setShowForm(false);
        setFormData({ goal_name: '', target_amount: '', saved_amount: '', target_date: format(new Date(), 'yyyy-MM-dd') });
      },
      onError: (error) => toast.error('Failed to create goal: ' + (error.response?.data?.error || error.message))
    }
  );

  const updateProgress = (id, saved_amount) => {
    api.put('/goals/' + id, { saved_amount }).then(() => {
      queryClient.invalidateQueries('goals');
      toast.success('Progress updated!');
    }).catch(() => toast.error('Failed to update'));
  };

  const deleteGoal = (id) => {
    if (window.confirm('Delete this goal?')) {
      api.delete('/goals/' + id).then(() => {
        queryClient.invalidateQueries('goals');
        toast.success('Goal deleted');
      }).catch(() => toast.error('Failed to delete'));
    }
  };

  const totalSaved = goals?.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0) || 0;
  const totalTarget = goals?.reduce((sum, g) => sum + parseFloat(g.target_amount), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h1><p className="text-gray-600 dark:text-gray-400">Track and achieve your financial goals</p></div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">+ New Goal</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Goals</p><p className="text-3xl font-bold">{goals?.length || 0}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Saved</p><p className="text-3xl font-bold text-green-600">{user?.currency} {totalSaved.toLocaleString()}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Overall Progress</p><p className="text-3xl font-bold text-indigo-600">{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.map(goal => {
            const progress = goal.target_amount > 0 ? ((goal.saved_amount || 0) / goal.target_amount * 100) : 0;
            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2"><FlagIcon className="h-6 w-6 text-indigo-600" /><h3 className="font-semibold text-lg">{goal.goal_name}</h3></div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                </div>
                <p className="text-sm text-gray-500 mb-2">Target: {user?.currency} {parseFloat(goal.target_amount).toLocaleString()} • Due: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</p>
                <div className="mb-3"><div className="flex justify-between text-sm mb-1"><span>Saved: {user?.currency} {parseFloat(goal.saved_amount || 0).toLocaleString()}</span><span>{progress.toFixed(1)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: progress + '%' }} /></div></div>
                <div className="flex gap-2"><input type="number" placeholder="Add amount" className="flex-1 p-2 border rounded-lg" id={'input-' + goal.id} /><button onClick={() => { const val = document.getElementById('input-' + goal.id).value; if (val) updateProgress(goal.id, parseFloat(goal.saved_amount || 0) + parseFloat(val)); }} className="px-3 py-2 bg-indigo-600 text-white rounded-lg">Add</button></div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create Savings Goal</h2>
            <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(formData); }}>
              <input type="text" placeholder="Goal Name" value={formData.goal_name} onChange={(e) => setFormData({...formData, goal_name: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" placeholder="Target Amount" value={formData.target_amount} onChange={(e) => setFormData({...formData, target_amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <input type="number" placeholder="Current Savings (Optional)" value={formData.saved_amount} onChange={(e) => setFormData({...formData, saved_amount: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" />
              <input type="date" value={formData.target_date} onChange={(e) => setFormData({...formData, target_date: e.target.value})} className="w-full p-2 mb-3 border rounded-lg" required />
              <div className="flex gap-3"><button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Create Goal</button><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-300 rounded-lg">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
