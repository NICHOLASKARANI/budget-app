import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportService';
import toast from 'react-hot-toast';

export default function FinancialReports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await api.get('/reports/financial', { params: { period: selectedPeriod } });
      setReportData(response.data);
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format) => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }
    
    setLoading(true);
    try {
      const data = [
        { Metric: 'Total Income', Value: user?.currency + ' ' + reportData.total_income.toFixed(2) },
        { Metric: 'Total Expenses', Value: user?.currency + ' ' + reportData.total_expenses.toFixed(2) },
        { Metric: 'Net Savings', Value: user?.currency + ' ' + reportData.net_savings.toFixed(2) }
      ];
      
      reportData.categories?.forEach(cat => {
        data.push({ Metric: cat.category + ' Expense', Value: user?.currency + ' ' + cat.total.toFixed(2) });
      });
      
      const filename = 'financial_report_' + new Date().toISOString().split('T')[0];
      
      if (format === 'pdf') exportToPDF(data, 'Financial Report', filename);
      else if (format === 'excel') exportToExcel(data, filename);
      else if (format === 'csv') exportToCSV(data, filename);
      
      toast.success('Report exported as ' + format.toUpperCase());
    } catch (error) {
      toast.error('Failed to export');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate comprehensive financial statements</p>
          </div>
          <div className="flex gap-3">
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="p-2 border rounded-lg">
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Annual</option>
            </select>
            <button onClick={generateReport} disabled={generating} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profit & Loss</h3>
              <p className="text-gray-500 text-sm">Income statement for period ending {reportData.period}</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-green-600">{user?.currency} {reportData.total_income.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Net Profit</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Balance Sheet</h3>
              <p className="text-gray-500 text-sm">As of {new Date().toLocaleDateString()}</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-blue-600">{user?.currency} {reportData.total_income.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Assets</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow</h3>
              <p className="text-gray-500 text-sm">Statement for {reportData.period}</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-purple-600">{user?.currency} {reportData.net_savings.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Net Cash Flow</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr><th className="p-3 text-left">Report Name</th><th className="p-3 text-left">Period</th><th className="p-3 text-left">Generated</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                <tr><td className="p-3">Monthly P&L</td><td className="p-3">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</td><td className="p-3">{new Date().toLocaleDateString()}</td><td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Final</span></td><td className="p-3"><button onClick={() => handleExport('pdf')} className="text-indigo-600">Download</button></td></tr>
                <tr><td className="p-3">Quarterly Balance Sheet</td><td className="p-3">Q1 {new Date().getFullYear()}</td><td className="p-3">{new Date().toLocaleDateString()}</td><td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Final</span></td><td className="p-3"><button onClick={() => handleExport('pdf')} className="text-indigo-600">Download</button></td></tr>
                <tr><td className="p-3">Cash Flow Statement</td><td className="p-3">Q1 {new Date().getFullYear()}</td><td className="p-3">{new Date().toLocaleDateString()}</td><td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Final</span></td><td className="p-3"><button onClick={() => handleExport('pdf')} className="text-indigo-600">Download</button></td></tr>
                <tr><td className="p-3">Budget vs Actual</td><td className="p-3">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</td><td className="p-3">{new Date().toLocaleDateString()}</td><td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Draft</span></td><td className="p-3"><button onClick={() => handleExport('excel')} className="text-indigo-600">Download</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
            <select className="w-full p-2 border rounded-lg mb-3"><option>Profit & Loss Statement</option><option>Balance Sheet</option><option>Cash Flow Statement</option></select>
            <select className="w-full p-2 border rounded-lg mb-3"><option>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</option><option>Q1 {new Date().getFullYear()}</option><option>Year to Date</option></select>
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg">Generate Report</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <div className="space-y-3">
              <button onClick={() => handleExport('pdf')} className="w-full p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"><span>PDF Document</span><span className="text-gray-500">For printing & sharing</span></button>
              <button onClick={() => handleExport('excel')} className="w-full p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"><span>Excel Spreadsheet</span><span className="text-gray-500">For further analysis</span></button>
              <button onClick={() => handleExport('csv')} className="w-full p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"><span>CSV File</span><span className="text-gray-500">Raw data export</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
