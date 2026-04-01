import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  PhoneIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, totalPayments: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  // Admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/admin/login', { password: adminPassword });
      localStorage.setItem('adminToken', response.data.token);
      setAdminToken(response.data.token);
      setIsAuthenticated(true);
      toast.success('Logged in as Admin');
      fetchData();
    } catch (error) {
      toast.error('Invalid admin password');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      const [usersRes, paymentsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/payments'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    if (adminToken) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [adminToken]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  const getTabClass = (tab) => {
    const baseClass = 'py-4 px-6 text-sm font-medium capitalize';
    if (activeTab === tab) {
      return baseClass + ' border-b-2 border-indigo-500 text-indigo-600';
    }
    return baseClass + ' text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
            <p className="mt-2 text-gray-600">Enter admin password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">FinovaTrack Admin</h1>
                <p className="text-sm text-indigo-200">Payment & User Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <UsersIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600"></p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Payments</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalPayments}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['dashboard', 'users', 'payments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={getTabClass(tab)}
                >
                  {tab === 'dashboard' ? 'Dashboard' : tab === 'users' ? 'Users' : 'Payments'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Currency</th>
                      <th className="text-left py-3 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4 font-medium">{user.username}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.currency}</td>
                        <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">User ID</th>
                      <th className="text-left py-3 px-4">Plan</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Method</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{payment.id}</td>
                        <td className="py-3 px-4">{payment.user_id}</td>
                        <td className="py-3 px-4 font-medium">{payment.plan}</td>
                        <td className="py-3 px-4 text-green-600 font-bold"></td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                            {payment.payment_method}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={'px-2 py-1 text-xs rounded-full ' + (payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Payment Methods Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-3">
                        <PhoneIcon className="h-6 w-6 text-green-600" />
                        <h4 className="font-semibold">M-Pesa</h4>
                      </div>
                      <p className="text-sm text-gray-600">Paybill Number: <strong>0721 669850</strong></p>
                      <p className="text-xs text-gray-500 mt-2">Account: FinovaTrack</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-3">
                        <CreditCardIcon className="h-6 w-6 text-blue-600" />
                        <h4 className="font-semibold">Visa Card</h4>
                      </div>
                      <p className="text-sm text-gray-600">Card Number: <strong>4478 1500 0287 8906</strong></p>
                      <p className="text-sm text-gray-600">CVV: <strong>685</strong> | Expiry: <strong>03/31</strong></p>
                    </div>
                  </div>
                </div>

                {/* Recent Payments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map(payment => (
                      <div key={payment.id} className="bg-white rounded-lg p-4 border flex justify-between items-center">
                        <div>
                          <p className="font-medium">User #{payment.user_id}</p>
                          <p className="text-sm text-gray-500">{payment.plan} Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600"></p>
                          <p className="text-xs text-gray-500">{payment.payment_method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
