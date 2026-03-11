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

  // Configure axios defaults when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      console.log('Token set in axios headers');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Token removed from axios headers');
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
        console.log('Verifying token...');
        const response = await axios.get(apiUrl + '/auth/me');
        setUser(response.data);
        console.log('Token verified, user:', response.data);
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
      console.log('Attempting login...');
      const response = await axios.post(apiUrl + '/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Logged in successfully!');
      console.log('Login successful, token stored');
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password, currency) => {
    try {
      console.log('Attempting registration...');
      const response = await axios.post(apiUrl + '/auth/register', {
        username,
        email,
        password,
        currency
      });
      
      console.log('Registration response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Registered successfully!');
      console.log('Registration successful, token stored');
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
