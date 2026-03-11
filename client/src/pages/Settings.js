import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  BanknotesIcon,
  ClockIcon,
  BellAlertIcon,
  LanguageIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

const themes = [
  { name: 'Light', value: 'light', class: 'bg-white text-gray-900' },
  { name: 'Dark', value: 'dark', class: 'bg-gray-900 text-white' },
  { name: 'System', value: 'system', class: 'bg-indigo-600 text-white' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', example: '03/15/2026' },
  { value: 'DD/MM/YYYY', example: '15/03/2026' },
  { value: 'YYYY-MM-DD', example: '2026-03-15' },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    currency: user?.currency || 'USD',
    year: new Date().getFullYear(),
    startingBalance: 0,
    payFrequency: 'Monthly',
    fiscalYearStart: 'January',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    monthlyReports: true,
    budgetAlerts: true,
    twoFactorAuth: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      const savedSettings = response.data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
      setSettings(prev => ({ ...prev, ...savedSettings }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/settings', settings);
      if (updateUser) {
        updateUser({ ...user, currency: settings.currency });
      }
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CurrencyDollarIcon },
    { id: 'preferences', name: 'Preferences', icon: PaintBrushIcon },
    { id: 'notifications', name: 'Notifications', icon: BellAlertIcon },
    { id: 'security', name: 'Security', icon: DevicePhoneMobileIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Customize your budget tracker experience
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  transition-colors duration-200 whitespace-nowrap
                  
                }
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h2 className="text-xl font-semibold text-white">General Settings</h2>
                  <p className="text-indigo-100 text-sm mt-1">Manage your basic preferences</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Currency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Currency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSettings({ ...settings, currency: currency.code })}
                          className={
                            relative p-4 rounded-xl border-2 transition-all duration-200
                            hover:shadow-lg hover:scale-105 transform
                            
                          }
                        >
                          <div className="text-3xl mb-2">{currency.flag}</div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{currency.symbol}</div>
                          <div className="text-sm font-medium text-gray-700">{currency.code}</div>
                          <div className="text-xs text-gray-500 truncate">{currency.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Year
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <button
                          key={year}
                          onClick={() => setSettings({ ...settings, year })}
                          className={
                            py-3 px-4 rounded-lg border-2 font-medium transition-all
                            
                          }
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Starting Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Starting Balance
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-lg">
                          {currencies.find(c => c.code === settings.currency)?.symbol || '$'}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={settings.startingBalance}
                        onChange={(e) => setSettings({ ...settings, startingBalance: parseFloat(e.target.value) || 0 })}
                        className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This will be your initial balance for net worth calculations
                    </p>
                  </div>

                  {/* Pay Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Frequency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Weekly', 'Bi-weekly', 'Monthly', 'Yearly'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setSettings({ ...settings, payFrequency: freq })}
                          className={
                            py-3 px-4 rounded-lg border-2 font-medium transition-all
                            
                          }
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fiscal Year Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiscal Year Start
                    </label>
                    <select
                      value={settings.fiscalYearStart}
                      onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
                      className="mt-1 block w-full pl-4 pr-10 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-green-600 to-teal-600">
                  <h2 className="text-xl font-semibold text-white">Preferences</h2>
                  <p className="text-green-100 text-sm mt-1">Customize your app experience</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Language
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSettings({ ...settings, language: lang.code })}
                          className={
                            p-4 rounded-xl border-2 transition-all duration-200
                            hover:shadow-lg hover:scale-105 transform
                            
                          }
                        >
                          <div className="text-3xl mb-2">{lang.flag}</div>
                          <div className="text-sm font-medium text-gray-700">{lang.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setSettings({ ...settings, theme: theme.value })}
                          className={
                            p-4 rounded-xl border-2 transition-all duration-200
                            hover:shadow-lg transform
                            
                            
                          }
                        >
                          <div className="font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Date Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dateFormats.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setSettings({ ...settings, dateFormat: format.value })}
                          className={
                            p-4 rounded-xl border-2 transition-all duration-200
                            hover:shadow-lg hover:scale-105 transform
                            
                          }
                        >
                          <div className="font-medium text-gray-900">{format.value}</div>
                          <div className="text-sm text-gray-500 mt-1">{format.example}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-yellow-500 to-orange-500">
                  <h2 className="text-xl font-semibold text-white">Notifications</h2>
                  <p className="text-yellow-100 text-sm mt-1">Manage your alert preferences</p>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                    { id: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                    { id: 'monthlyReports', label: 'Monthly Reports', description: 'Get monthly financial summaries' },
                    { id: 'budgetAlerts', label: 'Budget Alerts', description: 'Alert when nearing budget limits' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, [item.id]: !settings[item.id] })}
                        className={
                          relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                          
                        }
                      >
                        <span
                          className={
                            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                            
                          }
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-pink-600">
                  <h2 className="text-xl font-semibold text-white">Security</h2>
                  <p className="text-red-100 text-sm mt-1">Manage your account security</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Two Factor Authentication */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                      className={
                        relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        
                      }
                    >
                      <span
                        className={
                          inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                          
                        }
                      />
                    </button>
                  </div>

                  {/* Change Password */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">Change Password</p>
                    <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Update Password
                    </button>
                  </div>

                  {/* Session Management */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-2">Active Sessions</p>
                    <p className="text-sm text-gray-600 mb-3">You're currently logged in on this device</p>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Sign out all other devices
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Preview & Save */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl sticky top-6">
              {/* Currency Preview */}
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-t-2xl">
                <h3 className="text-white text-lg font-semibold mb-4">Live Preview</h3>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <p className="text-indigo-100 text-sm mb-2">Your currency symbol</p>
                  <div className="text-5xl font-bold text-white mb-2">
                    {currencies.find(c => c.code === settings.currency)?.symbol || '$'}
                  </div>
                  <p className="text-indigo-100 text-sm">
                    {currencies.find(c => c.code === settings.currency)?.name}
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="p-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    'Save Settings'
                  )}
                </button>

                <div className="mt-4 text-xs text-center text-gray-500">
                  Changes are applied immediately after saving
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">💡 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">1</span>
              <p className="text-sm text-indigo-800">Choose your currency first - it affects all financial displays</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">2</span>
              <p className="text-sm text-indigo-800">Set your starting balance for accurate net worth tracking</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">3</span>
              <p className="text-sm text-indigo-800">Enable notifications to never miss important alerts</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">4</span>
              <p className="text-sm text-indigo-800">All settings sync across your devices automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
