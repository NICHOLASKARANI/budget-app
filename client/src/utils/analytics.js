import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your Google Analytics ID
};

// Track page views
export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

// Track events
export const logEvent = (category, action, label = '') => {
  ReactGA.event({
    category,
    action,
    label
  });
};

// Track user actions
export const trackUserAction = {
  login: () => logEvent('User', 'Login'),
  register: () => logEvent('User', 'Register'),
  addIncome: () => logEvent('Transaction', 'Add Income'),
  addExpense: () => logEvent('Transaction', 'Add Expense'),
  createBudget: () => logEvent('Budget', 'Create'),
  setGoal: () => logEvent('Goal', 'Set'),
  exportReport: () => logEvent('Report', 'Export')
};
