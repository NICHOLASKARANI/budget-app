import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

const categories = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Side Hustle',
  'Rental Income',
  'Other'
];

export default function IncomeForm({ initialData, onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      source: '',
      category: '',
      amount: '',
      description: '',
      is_recurring: false
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => {
      if (initialData) {
        return api.put(`/income/${initialData.id}`, data);
      }
      return api.post('/income', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('income');
        toast.success(initialData ? 'Income updated' : 'Income added');
        onSuccess();
      },
      onError: () => {
        toast.error(initialData ? 'Failed to update' : 'Failed to add');
      }
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="input-field"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source *
        </label>
        <input
          type="text"
          {...register('source', { required: 'Source is required' })}
          className="input-field"
          placeholder="e.g., Monthly Salary"
        />
        {errors.source && (
          <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="input-field"
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount *
        </label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
          className="input-field"
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows="3"
          className="input-field"
          placeholder="Optional notes"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('is_recurring')}
          id="is_recurring"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900">
          This is recurring income
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="btn-primary"
        >
          {mutation.isLoading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}