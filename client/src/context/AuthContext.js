import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const apiUrl = process.env.REACT_APP_API_URL || 'https://budget-app-server-two.vercel.app/api';

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl + '/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, apiUrl]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(apiUrl + '/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password, currency) => {
    try {
      const response = await axios.post(apiUrl + '/auth/register', {
        username,
        email,
        password,
        currency
      });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Registered successfully!');
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(apiUrl + '/auth/forgot-password', { email });
      if (response.data.demoOTP) {
        console.log('Demo OTP:', response.data.demoOTP);
      }
      toast.success('OTP sent to your email!');
      return { success: true, demoOTP: response.data.demoOTP };
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to send OTP');
      return { success: false };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(apiUrl + '/auth/verify-otp', { email, otp });
      toast.success('OTP verified!');
      return { success: true, resetToken: response.data.resetToken };
    } catch (error) {
      console.error('OTP verification error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Invalid OTP');
      return { success: false };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      await axios.post(apiUrl + '/auth/reset-password', { resetToken, newPassword });
      toast.success('Password reset successfully!');
      return true;
    } catch (error) {
      console.error('Password reset error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to reset password');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, forgotPassword, verifyOTP, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
