import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Import pages
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
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';

// Analytics
import { initGA, logPageView } from './utils/analytics';
import './index.css';

const queryClient = new QueryClient();

// Analytics wrapper component
function AnalyticsWrapper({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AnalyticsWrapper>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/app/start-here" />} />
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
          </AnalyticsWrapper>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
