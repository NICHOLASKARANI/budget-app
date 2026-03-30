import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportService';
import toast from 'react-hot-toast';

export default function SupportReports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/support', { params: { period: selectedPeriod } });
      setReportData(response.data);
      toast.success('Support report generated');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }
    
    try {
      const data = [
        { Metric: 'Total Tickets', Value: reportData.total_tickets },
        { Metric: 'Average Response Time', Value: reportData.avg_response_time + ' hours' },
        { Metric: 'Average Resolution Time', Value: reportData.avg_resolution_time + ' hours' },
        { Metric: 'CSAT Score', Value: reportData.csat_score + '%' }
      ];
      
      reportData.common_issues?.forEach(issue => {
        data.push({ Metric: issue.issue, Value: issue.count + ' tickets' });
      });
      
      const filename = 'support_report_' + new Date().toISOString().split('T')[0];
      
      if (format === 'pdf') exportToPDF(data, 'Support Report', filename);
      else if (format === 'excel') exportToExcel(data, filename);
      else if (format === 'csv') exportToCSV(data, filename);
      
      toast.success('Report exported as ' + format.toUpperCase());
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate support analytics reports</p>
          </div>
          <div className="flex gap-3">
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="p-2 border rounded-lg">
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
            </select>
            <button onClick={generateReport} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold">Weekly Summary</h3>
              <p className="text-gray-500 text-sm">Mar 23 - Mar 29, 2026</p>
              <div className="mt-4 space-y-2"><p className="text-2xl font-bold">{reportData.total_tickets}</p><p className="text-gray-500">Tickets</p></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold">Monthly Report</h3>
              <p className="text-gray-500 text-sm">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
              <div className="mt-4 space-y-2"><p className="text-2xl font-bold">{reportData.total_tickets}</p><p className="text-gray-500">Tickets</p></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold">Quarterly Review</h3>
              <p className="text-gray-500 text-sm">Q1 {new Date().getFullYear()}</p>
              <div className="mt-4 space-y-2"><p className="text-2xl font-bold">{reportData.total_tickets * 3}</p><p className="text-gray-500">Total Tickets</p></div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Available Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="p-3 text-left">Report Name</th><th className="p-3 text-left">Period</th><th className="p-3 text-left">Last Generated</th><th className="p-3 text-left">Actions</th></tr></thead>
              <tbody>
                <tr><td className="p-3">Daily Support Summary</td><td className="p-3">Daily</td><td className="p-3">Today, 9:00 AM</td><td className="p-3"><button onClick={() => handleExport('pdf')} className="text-indigo-600">Download</button></td></tr>
                <tr><td className="p-3">Weekly Performance Report</td><td className="p-3">Weekly</td><td className="p-3">Yesterday, 11:30 PM</td><td className="p-3"><button onClick={() => handleExport('excel')} className="text-indigo-600">Download</button></td></tr>
                <tr><td className="p-3">Monthly CSAT Analysis</td><td className="p-3">Monthly</td><td className="p-3">Apr 1, 2026</td><td className="p-3"><button onClick={() => handleExport('csv')} className="text-indigo-600">Download</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generate Custom Report</h3>
            <select className="w-full p-2 border rounded-lg mb-3"><option>Daily Summary</option><option>Weekly Performance</option><option>Monthly Analysis</option></select>
            <select className="w-full p-2 border rounded-lg mb-3"><option>Last 7 days</option><option>Last 30 days</option><option>Last quarter</option></select>
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg">Generate Report</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <button onClick={() => handleExport('pdf')} className="w-full p-3 border rounded-lg mb-2 hover:bg-gray-50 flex justify-between"><span>PDF Document</span><span className="text-gray-500">For presentations</span></button>
            <button onClick={() => handleExport('excel')} className="w-full p-3 border rounded-lg mb-2 hover:bg-gray-50 flex justify-between"><span>Excel Spreadsheet</span><span className="text-gray-500">For analysis</span></button>
            <button onClick={() => handleExport('csv')} className="w-full p-3 border rounded-lg hover:bg-gray-50 flex justify-between"><span>CSV File</span><span className="text-gray-500">Raw data export</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
