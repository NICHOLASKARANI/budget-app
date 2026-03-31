import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/personal/start-here');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="FinovaTrack" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-xl" />
          <h2 className="text-4xl font-extrabold text-white">FinovaTrack</h2>
          <p className="mt-2 text-lg text-indigo-100">Smart Financial Management</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center">
              <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500">Don't have an account? Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
