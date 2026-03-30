import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportService';
import toast from 'react-hot-toast';

export default function AnnualSummary() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: summary, isLoading } = useQuery(['annual-summary', selectedYear], async () => {
    const [annualRes, monthlyRes, categoriesRes] = await Promise.all([
      api.get('/dashboard/annual', { params: { year: selectedYear } }).catch(() => ({ data: { total_income: 0, total_expenses: 0 } })),
      api.get('/dashboard/monthly', { params: { year: selectedYear } }).catch(() => ({ data: [] })),
      api.get('/expenses/categories', { params: { year: selectedYear } }).catch(() => ({ data: [] }))
    ]);
    return { annual: annualRes.data, monthly: monthlyRes.data, categories: categoriesRes.data };
  });

  const handleExport = (format) => {
    if (!summary?.monthly?.length) { toast.error('No data to export'); return; }
    const data = summary.monthly.map(m => ({ Month: m.month, Income: m.income || 0, Expenses: m.expenses || 0, Savings: (m.income || 0) - (m.expenses || 0) }));
    const filename = nnual_report_;
    if (format === 'pdf') exportToPDF(data, Annual Report , filename);
    else if (format === 'excel') exportToExcel(data, filename);
    else if (format === 'csv') exportToCSV(data, filename);
    toast.success(Exported as );
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const savings = (summary?.annual?.total_income || 0) - (summary?.annual?.total_expenses || 0);
  const savingsRate = summary?.annual?.total_income > 0 ? (savings / summary.annual.total_income * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Annual Summary</h1><p className="text-gray-600 dark:text-gray-400">Year in review - {selectedYear}</p></div>
          <div className="flex gap-3"><select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="p-2 border rounded-lg"><option>2024</option><option>2025</option><option>2026</option></select><button onClick={() => handleExport('pdf')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2"><ArrowDownTrayIcon className="h-5 w-5" /> PDF</button><button onClick={() => handleExport('excel')} className="px-4 py-2 bg-green-600 text-white rounded-xl">Excel</button><button onClick={() => handleExport('csv')} className="px-4 py-2 bg-blue-600 text-white rounded-xl">CSV</button></div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Income</p><p className="text-2xl font-bold">{user?.currency} {(summary?.annual?.total_income || 0).toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Total Expenses</p><p className="text-2xl font-bold">{user?.currency} {(summary?.annual?.total_expenses || 0).toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Net Savings</p><p className="text-2xl font-bold text-green-600">{user?.currency} {savings.toLocaleString()}</p></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg"><p className="text-gray-500">Savings Rate</p><p className="text-2xl font-bold text-indigo-600">{savingsRate}%</p></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={summary?.monthly || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="income" fill="#4f46e5" /><Bar dataKey="expenses" fill="#ef4444" /></BarChart></ResponsiveContainer></div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Month</th><th className="p-3 text-left">Income</th><th className="p-3 text-left">Expenses</th><th className="p-3 text-left">Savings</th><th className="p-3 text-left">Savings Rate</th></tr></thead><tbody>{summary?.monthly?.map(row => { const savings = (row.income || 0) - (row.expenses || 0); const rate = row.income > 0 ? ((savings / row.income) * 100).toFixed(1) : 0; return (<tr key={row.month} className="border-t"><td className="p-3">{row.month}</td><td className="p-3">{user?.currency} {(row.income || 0).toLocaleString()}</td><td className="p-3">{user?.currency} {(row.expenses || 0).toLocaleString()}</td><td className="p-3 text-green-600">{user?.currency} {savings.toLocaleString()}</td><td className="p-3">{rate}%</td></tr>); })}</tbody></table>
        </div>
      </div>
    </div>
  );
}
