import api from './api';

// Business metrics service
export const businessService = {
  // Get revenue data
  getRevenue: async (period = 'month') => {
    try {
      // Mock data for now - replace with actual API calls
      return {
        total: 125000,
        monthlyData: [
          { month: 'Jan', revenue: 45000, costs: 32000 },
          { month: 'Feb', revenue: 52000, costs: 38000 },
          { month: 'Mar', revenue: 48000, costs: 35000 },
          { month: 'Apr', revenue: 58000, costs: 41000 },
          { month: 'May', revenue: 62000, costs: 43000 },
          { month: 'Jun', revenue: 68000, costs: 47000 }
        ],
        profitMarginData: [
          { month: 'Jan', margin: 28.9 },
          { month: 'Feb', margin: 26.9 },
          { month: 'Mar', margin: 27.1 },
          { month: 'Apr', margin: 29.3 },
          { month: 'May', margin: 30.6 },
          { month: 'Jun', margin: 30.9 }
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue:', error);
      return { total: 0, monthlyData: [], profitMarginData: [] };
    }
  },

  // Get costs data
  getCosts: async (period = 'month') => {
    return {
      total: 78450,
      fixed: 45200,
      variable: 33250,
      categories: [
        { name: 'Salaries', amount: 35000 },
        { name: 'Rent', amount: 12000 },
        { name: 'Marketing', amount: 15000 },
        { name: 'Operations', amount: 16450 }
      ]
    };
  },

  // Get cash flow data
  getCashFlow: async (period = 'month') => {
    return {
      operating: 42500,
      investing: -15000,
      financing: 10000,
      monthlyData: [
        { month: 'Jan', operating: 32000, investing: -5000, financing: 2000 },
        { month: 'Feb', operating: 38000, investing: -8000, financing: 3000 },
        { month: 'Mar', operating: 35000, investing: -6000, financing: 2500 },
        { month: 'Apr', operating: 41000, investing: -10000, financing: 4000 },
        { month: 'May', operating: 43000, investing: -12000, financing: 3500 },
        { month: 'Jun', operating: 47000, investing: -15000, financing: 4500 }
      ]
    };
  },

  // Get budget utilization
  getBudgetUtilization: async () => {
    return {
      departments: [
        { name: 'Marketing', budget: 50000, spent: 42500, utilization: 85 },
        { name: 'Sales', budget: 75000, spent: 68250, utilization: 91 },
        { name: 'R&D', budget: 120000, spent: 96000, utilization: 80 },
        { name: 'Operations', budget: 80000, spent: 72000, utilization: 90 },
        { name: 'HR', budget: 30000, spent: 24000, utilization: 80 }
      ]
    };
  },

  // Get forecast data
  getForecast: async () => {
    return {
      data: [
        { month: 'Jul', forecast: 72000, actual: 0 },
        { month: 'Aug', forecast: 75000, actual: 0 },
        { month: 'Sep', forecast: 78000, actual: 0 },
        { month: 'Oct', forecast: 82000, actual: 0 },
        { month: 'Nov', forecast: 85000, actual: 0 },
        { month: 'Dec', forecast: 90000, actual: 0 }
      ]
    };
  }
};

// Support metrics service
export const supportService = {
  // Get ticket data
  getTickets: async (period = 'week', team = 'all') => {
    return {
      total: 234,
      open: 45,
      resolved: 189,
      trend: [
        { date: 'Mon', tickets: 42 },
        { date: 'Tue', tickets: 38 },
        { date: 'Wed', tickets: 45 },
        { date: 'Thu', tickets: 40 },
        { date: 'Fri', tickets: 35 },
        { date: 'Sat', tickets: 22 },
        { date: 'Sun', tickets: 12 }
      ],
      performance: [
        { date: 'Mon', responseTime: 1.2, resolutionTime: 4.5 },
        { date: 'Tue', responseTime: 1.5, resolutionTime: 5.2 },
        { date: 'Wed', responseTime: 1.1, resolutionTime: 3.8 },
        { date: 'Thu', responseTime: 1.3, resolutionTime: 4.2 },
        { date: 'Fri', responseTime: 1.4, resolutionTime: 4.8 }
      ]
    };
  },

  // Get response time data
  getResponseTime: async (period = 'week') => {
    return { average: 1.3 };
  },

  // Get resolution time data
  getResolutionTime: async (period = 'week') => {
    return { average: 4.5 };
  },

  // Get customer satisfaction data
  getCustomerSatisfaction: async (period = 'week') => {
    return {
      score: 94,
      trend: [
        { date: 'Mon', csat: 92 },
        { date: 'Tue', csat: 93 },
        { date: 'Wed', csat: 95 },
        { date: 'Thu', csat: 94 },
        { date: 'Fri', csat: 96 }
      ]
    };
  },

  // Get common issues data
  getCommonIssues: async (period = 'week') => {
    return {
      common: [
        { issue: 'Login Problems', count: 45 },
        { issue: 'Payment Failed', count: 38 },
        { issue: 'Account Setup', count: 32 },
        { issue: 'Feature Request', count: 28 },
        { issue: 'Bug Report', count: 25 }
      ]
    };
  },

  // Get team performance data
  getTeamPerformance: async (period = 'week') => {
    return {
      members: [
        { name: 'John Smith', assigned: 45, resolved: 42, avgResponseTime: 1.2, avgResolutionTime: 3.8, csat: 96, performance: 95 },
        { name: 'Sarah Johnson', assigned: 52, resolved: 48, avgResponseTime: 1.1, avgResolutionTime: 4.2, csat: 94, performance: 92 },
        { name: 'Mike Wilson', assigned: 38, resolved: 35, avgResponseTime: 1.4, avgResolutionTime: 4.5, csat: 93, performance: 88 },
        { name: 'Emily Brown', assigned: 41, resolved: 39, avgResponseTime: 1.3, avgResolutionTime: 4.1, csat: 95, performance: 93 },
        { name: 'David Lee', assigned: 58, resolved: 52, avgResponseTime: 1.5, avgResolutionTime: 5.2, csat: 92, performance: 86 }
      ],
      efficiency: 92
    };
  }
};
