import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Import all pages
import StartHere from './pages/StartHere';
import Dashboard from './pages/Dashboard';
import MonthlyDashboard from './pages/MonthlyDashboard';
import IncomeTracker from './pages/IncomeTracker';
import ExpenseTracker from './pages/ExpenseTracker';
import BudgetPlanner from './pages/BudgetPlanner';
import SavingsGoals from './pages/SavingsGoals';
import NetWorthTracker from './pages/NetWorthTracker';
import SubscriptionTracker from './pages/SubscriptionTracker';
import AnnualSummary from './pages/AnnualSummary';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/start-here" />} />
              <Route path="start-here" element={<StartHere />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="monthly-dashboard" element={<MonthlyDashboard />} />
              <Route path="income" element={<IncomeTracker />} />
              <Route path="expenses" element={<ExpenseTracker />} />
              <Route path="budget" element={<BudgetPlanner />} />
              <Route path="goals" element={<SavingsGoals />} />
              <Route path="subscriptions" element={<SubscriptionTracker />} />
              <Route path="networth" element={<NetWorthTracker />} />
              <Route path="reports" element={<AnnualSummary />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
