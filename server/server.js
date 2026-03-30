const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage
const storage = {
  users: [],
  income: [],
  expenses: [],
  budgets: [],
  goals: [],
  subscriptions: [],
  assets: [],
  liabilities: [],
  settings: []
};

// Helper to generate IDs
let nextId = 1;
const getNextId = () => nextId++;

// Initialize demo data
storage.users.push({
  id: 1,
  username: 'demo',
  email: 'demo@example.com',
  password_hash: 'demo123',
  currency: 'USD'
});

// CORS configuration
app.use(cors({
  origin: ['https://budget-app-client-lyart.vercel.app', 'http://localhost:3000', 'https://budget-app-client.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Simple token verification - accept any token for demo
  req.user = { id: 1, username: 'demo' };
  next();
};

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, currency } = req.body;
  
  const existingUser = storage.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: getNextId(),
    username,
    email,
    password_hash: password,
    currency: currency || 'USD'
  };
  storage.users.push(newUser);
  
  const token = 'token-' + Date.now() + '-' + newUser.id;
  res.json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email, currency: newUser.currency } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = storage.users.find(u => u.email === email);
  if (!user || user.password_hash !== password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  
  const token = 'token-' + Date.now() + '-' + user.id;
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, currency: user.currency } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = storage.users.find(u => u.id === req.user.id);
  res.json({ id: user.id, username: user.username, email: user.email, currency: user.currency });
});

// ============ INCOME ROUTES ============
app.get('/api/income', authenticateToken, (req, res) => {
  const { month, year } = req.query;
  let userIncome = storage.income.filter(i => i.user_id === req.user.id);
  
  if (month && year) {
    userIncome = userIncome.filter(i => {
      const date = new Date(i.date);
      return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
    });
  }
  
  res.json(userIncome);
});

app.post('/api/income', authenticateToken, (req, res) => {
  const { date, source, category, amount, description, payment_method, location } = req.body;
  const newIncome = {
    id: getNextId(),
    user_id: req.user.id,
    date,
    source,
    category,
    amount: parseFloat(amount),
    description: description || '',
    payment_method: payment_method || 'bank',
    location: location || '',
    created_at: new Date().toISOString()
  };
  storage.income.push(newIncome);
  res.json(newIncome);
});

app.put('/api/income/:id', authenticateToken, (req, res) => {
  const index = storage.income.findIndex(i => i.id === parseInt(req.params.id) && i.user_id === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  storage.income[index] = { ...storage.income[index], ...req.body, amount: parseFloat(req.body.amount) };
  res.json(storage.income[index]);
});

app.delete('/api/income/:id', authenticateToken, (req, res) => {
  storage.income = storage.income.filter(i => i.id !== parseInt(req.params.id) || i.user_id !== req.user.id);
  res.json({ message: 'Deleted' });
});

// ============ EXPENSES ROUTES ============
app.get('/api/expenses', authenticateToken, (req, res) => {
  const { month, year } = req.query;
  let userExpenses = storage.expenses.filter(e => e.user_id === req.user.id);
  
  if (month && year) {
    userExpenses = userExpenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
    });
  }
  
  res.json(userExpenses);
});

app.post('/api/expenses', authenticateToken, (req, res) => {
  const { date, name, category, type, amount, description } = req.body;
  const newExpense = {
    id: getNextId(),
    user_id: req.user.id,
    date,
    name,
    category,
    type,
    amount: parseFloat(amount),
    description: description || '',
    created_at: new Date().toISOString()
  };
  storage.expenses.push(newExpense);
  res.json(newExpense);
});

// ============ BUDGETS ROUTES ============
app.get('/api/budgets', authenticateToken, (req, res) => {
  const { month, year } = req.query;
  let userBudgets = storage.budgets.filter(b => b.user_id === req.user.id);
  
  if (month && year) {
    userBudgets = userBudgets.filter(b => b.month === parseInt(month) && b.year === parseInt(year));
  }
  
  res.json(userBudgets);
});

app.post('/api/budgets', authenticateToken, (req, res) => {
  const { category, budget_amount, month, year } = req.body;
  const existingIndex = storage.budgets.findIndex(b => 
    b.user_id === req.user.id && b.category === category && b.month === month && b.year === year
  );
  
  if (existingIndex !== -1) {
    storage.budgets[existingIndex].budget_amount = parseFloat(budget_amount);
    res.json(storage.budgets[existingIndex]);
  } else {
    const newBudget = {
      id: getNextId(),
      user_id: req.user.id,
      category,
      budget_amount: parseFloat(budget_amount),
      month: parseInt(month),
      year: parseInt(year)
    };
    storage.budgets.push(newBudget);
    res.json(newBudget);
  }
});

// ============ GOALS ROUTES ============
app.get('/api/goals', authenticateToken, (req, res) => {
  res.json(storage.goals.filter(g => g.user_id === req.user.id));
});

app.post('/api/goals', authenticateToken, (req, res) => {
  const { goal_name, target_amount, saved_amount, target_date } = req.body;
  const newGoal = {
    id: getNextId(),
    user_id: req.user.id,
    goal_name,
    target_amount: parseFloat(target_amount),
    saved_amount: parseFloat(saved_amount || 0),
    target_date,
    created_at: new Date().toISOString()
  };
  storage.goals.push(newGoal);
  res.json(newGoal);
});

app.put('/api/goals/:id', authenticateToken, (req, res) => {
  const index = storage.goals.findIndex(g => g.id === parseInt(req.params.id) && g.user_id === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  storage.goals[index].saved_amount = parseFloat(req.body.saved_amount);
  res.json(storage.goals[index]);
});

app.delete('/api/goals/:id', authenticateToken, (req, res) => {
  storage.goals = storage.goals.filter(g => g.id !== parseInt(req.params.id) || g.user_id !== req.user.id);
  res.json({ message: 'Deleted' });
});

// ============ SUBSCRIPTIONS ROUTES ============
app.get('/api/subscriptions', authenticateToken, (req, res) => {
  res.json(storage.subscriptions.filter(s => s.user_id === req.user.id));
});

app.post('/api/subscriptions', authenticateToken, (req, res) => {
  const { service_name, cost, billing_cycle, next_payment_date, category } = req.body;
  const newSubscription = {
    id: getNextId(),
    user_id: req.user.id,
    service_name,
    cost: parseFloat(cost),
    billing_cycle,
    next_payment_date,
    category: category || 'Subscriptions',
    created_at: new Date().toISOString()
  };
  storage.subscriptions.push(newSubscription);
  res.json(newSubscription);
});

app.delete('/api/subscriptions/:id', authenticateToken, (req, res) => {
  storage.subscriptions = storage.subscriptions.filter(s => s.id !== parseInt(req.params.id) || s.user_id !== req.user.id);
  res.json({ message: 'Deleted' });
});

// ============ NET WORTH ROUTES ============
app.get('/api/networth/assets', authenticateToken, (req, res) => {
  res.json(storage.assets.filter(a => a.user_id === req.user.id));
});

app.post('/api/networth/assets', authenticateToken, (req, res) => {
  const { name, type, value, location, condition, notes } = req.body;
  const newAsset = {
    id: getNextId(),
    user_id: req.user.id,
    name,
    type,
    value: parseFloat(value),
    location: location || '',
    condition: condition || 'Good',
    notes: notes || '',
    created_at: new Date().toISOString()
  };
  storage.assets.push(newAsset);
  res.json(newAsset);
});

app.delete('/api/networth/assets/:id', authenticateToken, (req, res) => {
  storage.assets = storage.assets.filter(a => a.id !== parseInt(req.params.id) || a.user_id !== req.user.id);
  res.json({ message: 'Deleted' });
});

app.get('/api/networth/liabilities', authenticateToken, (req, res) => {
  res.json(storage.liabilities.filter(l => l.user_id === req.user.id));
});

app.post('/api/networth/liabilities', authenticateToken, (req, res) => {
  const { name, type, amount, interestRate, dueDate, status, notes } = req.body;
  const newLiability = {
    id: getNextId(),
    user_id: req.user.id,
    name,
    type,
    amount: parseFloat(amount),
    interest_rate: parseFloat(interestRate || 0),
    due_date: dueDate || null,
    status: status || 'Active',
    notes: notes || '',
    created_at: new Date().toISOString()
  };
  storage.liabilities.push(newLiability);
  res.json(newLiability);
});

app.delete('/api/networth/liabilities/:id', authenticateToken, (req, res) => {
  storage.liabilities = storage.liabilities.filter(l => l.id !== parseInt(req.params.id) || l.user_id !== req.user.id);
  res.json({ message: 'Deleted' });
});

app.get('/api/networth', authenticateToken, (req, res) => {
  const assets = storage.assets.filter(a => a.user_id === req.user.id).reduce((sum, a) => sum + a.value, 0);
  const liabilities = storage.liabilities.filter(l => l.user_id === req.user.id).reduce((sum, l) => sum + l.amount, 0);
  res.json([{ month: new Date().toLocaleString('default', { month: 'long' }), year: new Date().getFullYear(), assets, liabilities, net_worth: assets - liabilities }]);
});

// ============ SETTINGS ROUTES ============
app.get('/api/settings', authenticateToken, (req, res) => {
  const userSettings = storage.settings.filter(s => s.user_id === req.user.id);
  res.json(userSettings);
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;
  for (const [key, value] of Object.entries(settings)) {
    const existingIndex = storage.settings.findIndex(s => s.user_id === req.user.id && s.setting_key === key);
    if (existingIndex !== -1) {
      storage.settings[existingIndex].setting_value = value.toString();
    } else {
      storage.settings.push({
        id: getNextId(),
        user_id: req.user.id,
        setting_key: key,
        setting_value: value.toString()
      });
    }
  }
  res.json({ message: 'Settings saved successfully!' });
});

// ============ DASHBOARD ROUTES ============
app.get('/api/dashboard/monthly', authenticateToken, (req, res) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const userIncome = storage.income.filter(i => i.user_id === req.user.id);
  const userExpenses = storage.expenses.filter(e => e.user_id === req.user.id);
  
  const monthlyData = months.slice(0, 6).map((month, idx) => {
    const monthNum = idx + 1;
    const income = userIncome.filter(i => new Date(i.date).getMonth() + 1 === monthNum).reduce((sum, i) => sum + i.amount, 0);
    const expenses = userExpenses.filter(e => new Date(e.date).getMonth() + 1 === monthNum).reduce((sum, e) => sum + e.amount, 0);
    return { month, month_num: monthNum, income, expenses, savings: income - expenses };
  });
  
  res.json(monthlyData);
});

app.get('/api/dashboard/annual', authenticateToken, (req, res) => {
  const total_income = storage.income.filter(i => i.user_id === req.user.id).reduce((sum, i) => sum + i.amount, 0);
  const total_expenses = storage.expenses.filter(e => e.user_id === req.user.id).reduce((sum, e) => sum + e.amount, 0);
  res.json({ total_income, total_expenses });
});

app.get('/api/expenses/categories', authenticateToken, (req, res) => {
  const { month, year } = req.query;
  let userExpenses = storage.expenses.filter(e => e.user_id === req.user.id);
  
  if (month && year) {
    userExpenses = userExpenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
    });
  }
  
  const categories = {};
  userExpenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });
  
  res.json(Object.entries(categories).map(([category, total]) => ({ category, total })));
});

// ============ REPORT ROUTES ============
app.get('/api/reports/financial', authenticateToken, (req, res) => {
  const total_income = storage.income.filter(i => i.user_id === req.user.id).reduce((sum, i) => sum + i.amount, 0);
  const total_expenses = storage.expenses.filter(e => e.user_id === req.user.id).reduce((sum, e) => sum + e.amount, 0);
  
  const categories = {};
  storage.expenses.filter(e => e.user_id === req.user.id).forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });
  
  res.json({
    period: 'year',
    total_income,
    total_expenses,
    net_savings: total_income - total_expenses,
    categories: Object.entries(categories).map(([category, total]) => ({ category, total }))
  });
});

app.get('/api/reports/support', authenticateToken, (req, res) => {
  res.json({
    period: 'Monthly',
    total_tickets: 234,
    avg_response_time: 1.3,
    avg_resolution_time: 4.5,
    csat_score: 94,
    common_issues: [
      { issue: 'Login Problems', count: 45 },
      { issue: 'Payment Failed', count: 38 },
      { issue: 'Account Setup', count: 32 }
    ]
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Premium Budget API is running!' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
