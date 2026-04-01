import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Import pages
import StartHere from './pages/personal/StartHere';
import PersonalDashboard from './pages/personal/Dashboard';
import MonthlyDashboard from './pages/personal/MonthlyDashboard';
import IncomeTracker from './pages/personal/IncomeTracker';
import ExpenseTracker from './pages/personal/ExpenseTracker';
import BudgetPlanner from './pages/personal/BudgetPlanner';
import SavingsGoals from './pages/personal/SavingsGoals';
import NetWorthTracker from './pages/personal/NetWorthTracker';
import SubscriptionTracker from './pages/personal/SubscriptionTracker';
import AnnualSummary from './pages/personal/AnnualSummary';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import AdminPanel from './pages/admin/AdminPanel';

// Business pages
import BusinessDashboard from './pages/business/Dashboard';
import RevenueTracker from './pages/business/RevenueTracker';
import CostTracker from './pages/business/CostTracker';
import ProfitMargin from './pages/business/ProfitMargin';
import CashFlow from './pages/business/CashFlow';
import BudgetUtilization from './pages/business/BudgetUtilization';
import ForecastVariance from './pages/business/ForecastVariance';
import FinancialReports from './pages/business/FinancialReports';

// Support pages
import SupportDashboard from './pages/support/Dashboard';
import TicketVolume from './pages/support/TicketVolume';
import ResponseTime from './pages/support/ResponseTime';
import ResolutionTime from './pages/support/ResolutionTime';
import CustomerSatisfaction from './pages/support/CustomerSatisfaction';
import CommonIssues from './pages/support/CommonIssues';
import TeamPerformance from './pages/support/TeamPerformance';
import SupportReports from './pages/support/SupportReports';

import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Protected Routes - Personal */}
            <Route path="/personal" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/personal/start-here" />} />
              <Route path="start-here" element={<StartHere />} />
              <Route path="dashboard" element={<PersonalDashboard />} />
              <Route path="monthly-dashboard" element={<MonthlyDashboard />} />
              <Route path="income" element={<IncomeTracker />} />
              <Route path="expenses" element={<ExpenseTracker />} />
              <Route path="budget" element={<BudgetPlanner />} />
              <Route path="goals" element={<SavingsGoals />} />
              <Route path="subscriptions" element={<SubscriptionTracker />} />
              <Route path="networth" element={<NetWorthTracker />} />
              <Route path="reports" element={<AnnualSummary />} />
            </Route>
            
            {/* Protected Routes - Business */}
            <Route path="/business" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/business/dashboard" />} />
              <Route path="dashboard" element={<BusinessDashboard />} />
              <Route path="revenue" element={<RevenueTracker />} />
              <Route path="costs" element={<CostTracker />} />
              <Route path="profit-margin" element={<ProfitMargin />} />
              <Route path="cash-flow" element={<CashFlow />} />
              <Route path="budget-utilization" element={<BudgetUtilization />} />
              <Route path="forecast" element={<ForecastVariance />} />
              <Route path="reports" element={<FinancialReports />} />
            </Route>
            
            {/* Protected Routes - Support */}
            <Route path="/support" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/support/dashboard" />} />
              <Route path="dashboard" element={<SupportDashboard />} />
              <Route path="ticket-volume" element={<TicketVolume />} />
              <Route path="response-time" element={<ResponseTime />} />
              <Route path="resolution-time" element={<ResolutionTime />} />
              <Route path="customer-satisfaction" element={<CustomerSatisfaction />} />
              <Route path="common-issues" element={<CommonIssues />} />
              <Route path="team-performance" element={<TeamPerformance />} />
              <Route path="reports" element={<SupportReports />} />
            </Route>
            
            {/* Settings */}
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* Redirect any unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
