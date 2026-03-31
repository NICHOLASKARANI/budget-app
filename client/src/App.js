import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';`nimport ForgotPassword from './pages/ForgotPassword';

// Personal Budget Pages
import StartHere from './pages/personal/StartHere';
import PersonalDashboard from './pages/personal/Dashboard';
import IncomeTracker from './pages/personal/IncomeTracker';
import ExpenseTracker from './pages/personal/ExpenseTracker';
import BudgetPlanner from './pages/personal/BudgetPlanner';
import SavingsGoals from './pages/personal/SavingsGoals';
import NetWorthTracker from './pages/personal/NetWorthTracker';
import SubscriptionTracker from './pages/personal/SubscriptionTracker';
import PersonalReports from './pages/personal/AnnualSummary';

// Business Financial Pages
import BusinessDashboard from './pages/business/Dashboard';
import RevenueTracker from './pages/business/RevenueTracker';
import CostTracker from './pages/business/CostTracker';
import ProfitMargin from './pages/business/ProfitMargin';
import CashFlow from './pages/business/CashFlow';
import BudgetUtilization from './pages/business/BudgetUtilization';
import ForecastVariance from './pages/business/ForecastVariance';
import FinancialReports from './pages/business/FinancialReports';

// Customer Support Pages
import SupportDashboard from './pages/support/Dashboard';
import TicketVolume from './pages/support/TicketVolume';
import ResponseTime from './pages/support/ResponseTime';
import ResolutionTime from './pages/support/ResolutionTime';
import CustomerSatisfaction from './pages/support/CustomerSatisfaction';
import CommonIssues from './pages/support/CommonIssues';
import TeamPerformance from './pages/support/TeamPerformance';
import SupportReports from './pages/support/SupportReports';

// Settings
import Settings from './pages/Settings';
import './index.css';

const queryClient = new QueryClient();

// Analytics Wrapper
function AnalyticsWrapper({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize analytics
    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname,
      });
    }
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
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />`n            <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes - Personal */}
              <Route path="/personal" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/personal/start-here" />} />
                <Route path="start-here" element={<StartHere />} />
                <Route path="dashboard" element={<PersonalDashboard />} />
                <Route path="income" element={<IncomeTracker />} />
                <Route path="expenses" element={<ExpenseTracker />} />
                <Route path="budget" element={<BudgetPlanner />} />
                <Route path="goals" element={<SavingsGoals />} />
                <Route path="subscriptions" element={<SubscriptionTracker />} />
                <Route path="networth" element={<NetWorthTracker />} />
                <Route path="reports" element={<PersonalReports />} />
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
              <Route path="/settings" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Settings />} />
              </Route>
              
              {/* Redirect any unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnalyticsWrapper>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

