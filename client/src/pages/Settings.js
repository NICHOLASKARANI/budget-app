import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  CurrencyDollarIcon, 
  PaintBrushIcon,
  BellAlertIcon,
  DevicePhoneMobileIcon,
  CloudArrowDownIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', region: 'North America' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', region: 'Europe' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', region: 'Europe' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', region: 'North America' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', region: 'Oceania' },
  // African Currencies
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', region: 'Africa' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', region: 'Africa' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', region: 'Africa' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭', region: 'Africa' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', region: 'Africa' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', flag: '🇲🇦', region: 'Africa' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿', region: 'Africa' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬', region: 'Africa' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc', flag: '🇷🇼', region: 'Africa' },
  // Asian Currencies
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', region: 'Asia' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', region: 'Asia' },
  // Other
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', region: 'South America' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', region: 'North America' }
];

const themes = [
  { name: 'Light', value: 'light', class: 'bg-white text-gray-900', icon: '☀️' },
  { name: 'Dark', value: 'dark', class: 'bg-gray-900 text-white', icon: '🌙' },
  { name: 'System', value: 'system', class: 'bg-indigo-600 text-white', icon: '🖥️' }
];

const dateFormats = [
  { value: 'MM/DD/YYYY', example: '03/15/2026' },
  { value: 'DD/MM/YYYY', example: '15/03/2026' },
  { value: 'YYYY-MM-DD', example: '2026-03-15' }
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
    theme: 'light',
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    monthlyReports: true,
    budgetAlerts: true,
    twoFactorAuth: false,
    offlineMode: true,
    autoBackup: true,
    dataPrivacy: true
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSettings(prev => ({ ...prev, theme: savedTheme }));
      applyTheme(savedTheme);
    }
    fetchSettings();
  }, []);

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      const savedSettings = response.data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
      setSettings(prev => ({ ...prev, ...savedSettings }));
      if (savedSettings.theme) {
        applyTheme(savedSettings.theme);
      }
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
      applyTheme(settings.theme);
      toast.success('✅ Settings saved successfully!');
      if (settings.offlineMode) {
        toast.success('📱 Offline mode enabled - data will sync when online');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const getTabClass = (tabId) => {
    const baseClass = 'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap';
    if (activeTab === tabId) {
      return baseClass + ' border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400';
    }
    return baseClass + ' border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300';
  };

  const getCurrencyButtonClass = (currencyCode) => {
    const baseClass = 'relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 transform';
    if (settings.currency === currencyCode) {
      return baseClass + ' border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-4 ring-indigo-600 ring-opacity-20';
    }
    return baseClass + ' border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800';
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CurrencyDollarIcon },
    { id: 'preferences', name: 'Preferences', icon: PaintBrushIcon },
    { id: 'notifications', name: 'Notifications', icon: BellAlertIcon },
    { id: 'security', name: 'Security', icon: DevicePhoneMobileIcon },
    { id: 'data', name: 'Data & Privacy', icon: CloudArrowDownIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Customize your budget tracker experience
          </p>
        </div>

        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={getTabClass(tab.id)}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'general' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h2 className="text-xl font-semibold text-white">General Settings</h2>
                  <p className="text-indigo-100 text-sm mt-1">Manage your basic preferences</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preferred Currency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSettings({ ...settings, currency: currency.code })}
                          className={getCurrencyButtonClass(currency.code)}
                        >
                          <div className="text-3xl mb-2">{currency.flag}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currency.symbol}</div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{currency.code}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{currency.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Year
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <button
                          key={year}
                          onClick={() => setSettings({ ...settings, year })}
                          className={`
                            py-3 px-4 rounded-lg border-2 font-medium transition-all
                            ${settings.year === year
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pay Frequency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Weekly', 'Bi-weekly', 'Monthly', 'Yearly'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setSettings({ ...settings, payFrequency: freq })}
                          className={`
                            py-3 px-4 rounded-lg border-2 font-medium transition-all
                            ${settings.payFrequency === freq
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-green-600 to-teal-600">
                  <h2 className="text-xl font-semibold text-white">Preferences</h2>
                  <p className="text-green-100 text-sm mt-1">Customize your app experience</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => {
                            setSettings({ ...settings, theme: theme.value });
                            applyTheme(theme.value);
                          }}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform
                            ${settings.theme === theme.value
                              ? 'border-green-600 ring-4 ring-green-600 ring-opacity-20'
                              : 'border-gray-200 dark:border-gray-700'
                            }
                            ${theme.class}
                          `}
                        >
                          <div className="text-2xl mb-2">{theme.icon}</div>
                          <div className="font-medium">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Date Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dateFormats.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setSettings({ ...settings, dateFormat: format.value })}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 transform
                            ${settings.dateFormat === format.value
                              ? 'border-green-600 bg-green-50 dark:bg-green-900/30 ring-4 ring-green-600 ring-opacity-20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{format.value}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format.example}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-cyan-600">
                  <h2 className="text-xl font-semibold text-white">Data & Privacy</h2>
                  <p className="text-blue-100 text-sm mt-1">Control your data and privacy settings</p>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { id: 'offlineMode', label: 'Offline Mode', description: 'Work without internet - data syncs when online', icon: '📱' },
                    { id: 'autoBackup', label: 'Auto Backup', description: 'Automatically backup your data to the cloud', icon: '☁️' },
                    { id: 'dataPrivacy', label: 'Privacy Mode', description: 'Keep your financial data private and encrypted', icon: '🔒' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{item.icon}</span>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, [item.id]: !settings[item.id] })}
                        className={`
                          relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                          ${settings[item.id] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                            ${settings[item.id] ? 'translate-x-7' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl sticky top-6">
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

              <div className="px-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Your data is encrypted and private</span>
                </div>
              </div>

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
                <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                  ✅ Changes applied immediately
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3">🔒 Your Data is Safe With Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">✓</span>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">End-to-end encryption for all your financial data</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">✓</span>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">GDPR compliant - your data never leaves your control</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">✓</span>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">Optional offline mode - store data locally on your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}