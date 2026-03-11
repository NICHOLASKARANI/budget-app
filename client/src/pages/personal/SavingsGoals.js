import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SavingsGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    saved_amount: '',
    target_date: format(new Date(), 'yyyy-MM-dd')
  });

  // Fetch goals
  const { data: goals, isLoading } = useQuery('goals', () =>
    api.get('/goals').then(res => res.data)
  );

  // Add goal mutation
  const addMutation = useMutation(
    (data) => api.post('/goals', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        toast.success('Goal created successfully');
        setShowForm(false);
        resetForm();
      },
      onError: () => toast.error('Failed to create goal')
    }
  );

  // Update goal progress mutation
  const updateProgressMutation = useMutation(
    ({ id, saved_amount }) => api.put('/goals/' + id, { saved_amount }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        toast.success('Progress updated');
      },
      onError: () => toast.error('Failed to update progress')
    }
  );

  // Delete goal mutation
  const deleteMutation = useMutation(
    (id) => api.delete('/goals/' + id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        toast.success('Goal deleted');
      },
      onError: () => toast.error('Failed to delete goal')
    }
  );

  const resetForm = () => {
    setFormData({
      goal_name: '',
      target_amount: '',
      saved_amount: '',
      target_date: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleProgressUpdate = (goal, newAmount) => {
    updateProgressMutation.mutate({ id: goal.id, saved_amount: newAmount });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalSaved = goals?.reduce((sum, g) => sum + parseFloat(g.saved_amount || 0), 0) || 0;
  const totalTarget = goals?.reduce((sum, g) => sum + parseFloat(g.target_amount), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Savings Goals</h1>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Track and achieve your financial goals
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Goal
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Total Goals</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{goals?.length || 0}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Total Saved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{user?.currency} {totalSaved.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-500">Overall Progress</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.map((goal) => {
            const progress = goal.target_amount > 0 
              ? ((goal.saved_amount || 0) / goal.target_amount * 100) 
              : 0;
            const daysLeft = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <FlagIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{goal.goal_name}</h3>
                      <p className="text-sm text-gray-500">Due {format(new Date(goal.target_date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(goal.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">
                      {user?.currency} {goal.saved_amount?.toLocaleString() || 0}
                    </span>
                    <span className="text-gray-500">
                      of {user?.currency} {goal.target_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: progress + '%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>
                  </div>
                </div>

                {/* Quick Update */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Add amount"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newAmount = parseFloat(e.target.value) + (goal.saved_amount || 0);
                        handleProgressUpdate(goal, newAmount);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      const newAmount = parseFloat(input.value) + (goal.saved_amount || 0);
                      handleProgressUpdate(goal, newAmount);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Savings Goal</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={formData.goal_name}
                    onChange={(e) => setFormData({...formData, goal_name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Emergency Fund, New Car"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Savings (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.saved_amount}
                    onChange={(e) => setFormData({...formData, saved_amount: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
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
