// Email notification service
const API_URL = process.env.REACT_APP_API_URL || 'https://budget-app-server-two.vercel.app/api';

export const emailService = {
  // Send bill reminder
  sendBillReminder: async (userId, subscription) => {
    try {
      const response = await fetch(API_URL + '/notifications/bill-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ userId, subscription })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending bill reminder:', error);
    }
  },

  // Send budget alert
  sendBudgetAlert: async (userId, category, budget, actual) => {
    try {
      const response = await fetch(API_URL + '/notifications/budget-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ userId, category, budget, actual })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending budget alert:', error);
    }
  },

  // Send goal achievement notification
  sendGoalAchieved: async (userId, goal) => {
    try {
      const response = await fetch(API_URL + '/notifications/goal-achieved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ userId, goal })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending goal notification:', error);
    }
  },

  // Send monthly summary
  sendMonthlySummary: async (userId, summary) => {
    try {
      const response = await fetch(API_URL + '/notifications/monthly-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ userId, summary })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending monthly summary:', error);
    }
  }
};
