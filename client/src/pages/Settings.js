import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' }
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    currency: user?.currency || 'USD',
    year: new Date().getFullYear(),
    payFrequency: 'Monthly',
    theme: 'light',
    emailNotifications: true,
    monthlyReports: true,
    budgetAlerts: true
  });

  useEffect(() => {
    loadTheme();
    fetchSettings();
  }, []);

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await api.get('/settings');
      if (response.data && response.data.length > 0) {
        const savedSettings = response.data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {});
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      await api.put('/settings', settings);
      
      if (updateUser) {
        updateUser({ ...user, currency: settings.currency });
      }
      
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Customize your budget tracker experience</p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Currency</label>
              <div className="grid grid-cols-4 gap-3">
                {currencies.map((curr) => {
                  const isActive = settings.currency === curr.code;
                  const buttonClass = "p-3 rounded-xl border-2 transition-all " + (isActive ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-700");
                  return (
                    <button
                      key={curr.code}
                      onClick={() => setSettings({ ...settings, currency: curr.code })}
                      className={buttonClass}
                    >
                      <div className="text-2xl">{curr.flag}</div>
                      <div className="font-bold">{curr.symbol}</div>
                      <div className="text-xs">{curr.code}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pay Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pay Frequency</label>
              <div className="grid grid-cols-4 gap-3">
                {['Weekly', 'Bi-weekly', 'Monthly', 'Yearly'].map((freq) => {
                  const isActive = settings.payFrequency === freq;
                  const freqClass = "py-2 px-4 rounded-lg border-2 " + (isActive ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-200 dark:border-gray-700");
                  return (
                    <button
                      key={freq}
                      onClick={() => setSettings({ ...settings, payFrequency: freq })}
                      className={freqClass}
                    >
                      {freq}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={"py-3 px-4 rounded-xl border-2 " + (settings.theme === 'light' ? "border-indigo-600 bg-indigo-50" : "border-gray-200")}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={"py-3 px-4 rounded-xl border-2 " + (settings.theme === 'dark' ? "border-indigo-600 bg-indigo-50" : "border-gray-200")}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'monthlyReports', label: 'Monthly Reports' },
                { key: 'budgetAlerts', label: 'Budget Alerts' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <button
                    onClick={() => toggleSetting(item.key)}
                    className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors " + (settings[item.key] ? "bg-indigo-600" : "bg-gray-300")}
                  >
                    <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (settings[item.key] ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          🔒 Your data is encrypted and private
        </div>
      </div>
    </div>
  );
}
