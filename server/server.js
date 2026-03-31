const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['https://www.finovatrack.com', 'https://finovatrack.com', 'https://budget-app-client-lyart.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory storage
let users = [];
let assets = [];
let liabilities = [];
let income = [];
let expenses = [];
let budgets = [];
let goals = [];
let subscriptions = [];
let settings = [];

let nextId = 1;
const getNextId = () => nextId++;

// Add demo user for testing
const createDemoUser = async () => {
  const existingUser = users.find(u => u.email === 'demo@finovatrack.com');
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    users.push({
      id: getNextId(),
      username: 'demo',
      email: 'demo@finovatrack.com',
      password: hashedPassword,
      currency: 'USD'
    });
    console.log('Demo user created: demo@finovatrack.com / demo123');
  }
};

// OTP storage
const otpStore = new Map();
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Initialize demo user
createDemoUser();

// ============ AUTH ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), message: 'Server is running!' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, currency } = req.body;
    console.log('Register:', { username, email });
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: getNextId(),
      username,
      email,
      password: hashedPassword,
      currency: currency || 'USD'
    };
    users.push(newUser);
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email, currency: newUser.currency } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login:', { email });
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, currency: user.currency } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email, currency: user.currency });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password:', { email });
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    console.log('OTP for', email, ':', otp);
    
    res.json({ message: 'OTP sent', demoOTP: otp });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);
    
    if (!stored) return res.status(400).json({ error: 'No OTP request found' });
    if (stored.expiresAt < Date.now()) return res.status(400).json({ error: 'OTP expired' });
    if (stored.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    
    const resetToken = jwt.sign({ email, purpose: 'reset-password' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '15m' });
    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.purpose !== 'reset-password') return res.status(400).json({ error: 'Invalid token' });
    
    const userIndex = users.findIndex(u => u.email === decoded.email);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    otpStore.delete(decoded.email);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// ============ NET WORTH ROUTES ============

// Get assets
app.get('/api/networth/assets', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userAssets = assets.filter(a => a.userId === decoded.id);
    res.json(userAssets);
  } catch (error) {
    res.json([]);
  }
});

// Add asset
app.post('/api/networth/assets', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { name, type, value, location, condition, notes } = req.body;
    
    const newAsset = {
      id: getNextId(),
      userId: decoded.id,
      name,
      type,
      value: parseFloat(value),
      location: location || '',
      condition: condition || 'Good',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    assets.push(newAsset);
    res.json(newAsset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete asset
app.delete('/api/networth/assets/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const id = parseInt(req.params.id);
    const assetIndex = assets.findIndex(a => a.id === id && a.userId === decoded.id);
    
    if (assetIndex === -1) return res.status(404).json({ error: 'Asset not found' });
    assets.splice(assetIndex, 1);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get liabilities
app.get('/api/networth/liabilities', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userLiabilities = liabilities.filter(l => l.userId === decoded.id);
    res.json(userLiabilities);
  } catch (error) {
    res.json([]);
  }
});

// Add liability
app.post('/api/networth/liabilities', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { name, type, amount, interestRate, dueDate, status, notes } = req.body;
    
    const newLiability = {
      id: getNextId(),
      userId: decoded.id,
      name,
      type,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate || 0),
      dueDate: dueDate || null,
      status: status || 'Active',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    liabilities.push(newLiability);
    res.json(newLiability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete liability
app.delete('/api/networth/liabilities/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const id = parseInt(req.params.id);
    const liabilityIndex = liabilities.findIndex(l => l.id === id && l.userId === decoded.id);
    
    if (liabilityIndex === -1) return res.status(404).json({ error: 'Liability not found' });
    liabilities.splice(liabilityIndex, 1);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get net worth history
app.get('/api/networth', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userAssets = assets.filter(a => a.userId === decoded.id);
    const userLiabilities = liabilities.filter(l => l.userId === decoded.id);
    const totalAssets = userAssets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = userLiabilities.reduce((sum, l) => sum + l.amount, 0);
    
    res.json([{
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      assets: totalAssets,
      liabilities: totalLiabilities,
      net_worth: totalAssets - totalLiabilities
    }]);
  } catch (error) {
    res.json([]);
  }
});

// ============ INCOME ROUTES ============
app.get('/api/income', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json(income.filter(i => i.userId === decoded.id));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/income', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const newIncome = { id: getNextId(), userId: decoded.id, ...req.body, amount: parseFloat(req.body.amount) };
    income.push(newIncome);
    res.json(newIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EXPENSES ROUTES ============
app.get('/api/expenses', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json(expenses.filter(e => e.userId === decoded.id));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/expenses', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const newExpense = { id: getNextId(), userId: decoded.id, ...req.body, amount: parseFloat(req.body.amount) };
    expenses.push(newExpense);
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ GOALS ROUTES ============
app.get('/api/goals', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json(goals.filter(g => g.userId === decoded.id));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/goals', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const newGoal = { id: getNextId(), userId: decoded.id, ...req.body, target_amount: parseFloat(req.body.target_amount), saved_amount: parseFloat(req.body.saved_amount || 0) };
    goals.push(newGoal);
    res.json(newGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/goals/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const id = parseInt(req.params.id);
    const goalIndex = goals.findIndex(g => g.id === id && g.userId === decoded.id);
    
    if (goalIndex === -1) return res.status(404).json({ error: 'Goal not found' });
    goals[goalIndex].saved_amount = parseFloat(req.body.saved_amount);
    res.json(goals[goalIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/goals/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const id = parseInt(req.params.id);
    goals = goals.filter(g => !(g.id === id && g.userId === decoded.id));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SUBSCRIPTIONS ROUTES ============
app.get('/api/subscriptions', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json(subscriptions.filter(s => s.userId === decoded.id));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/subscriptions', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const newSub = { id: getNextId(), userId: decoded.id, ...req.body, cost: parseFloat(req.body.cost) };
    subscriptions.push(newSub);
    res.json(newSub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const id = parseInt(req.params.id);
    subscriptions = subscriptions.filter(s => !(s.id === id && s.userId === decoded.id));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BUDGETS ROUTES ============
app.get('/api/budgets', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    res.json(budgets.filter(b => b.userId === decoded.id && b.month === month && b.year === year));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/budgets', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { category, budget_amount, month, year } = req.body;
    
    const existingIndex = budgets.findIndex(b => b.userId === decoded.id && b.category === category && b.month === month && b.year === year);
    if (existingIndex !== -1) {
      budgets[existingIndex].budget_amount = parseFloat(budget_amount);
      res.json(budgets[existingIndex]);
    } else {
      const newBudget = { id: getNextId(), userId: decoded.id, category, budget_amount: parseFloat(budget_amount), month, year };
      budgets.push(newBudget);
      res.json(newBudget);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SETTINGS ROUTES ============
app.get('/api/settings', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json(settings.filter(s => s.userId === decoded.id));
  } catch (error) {
    res.json([]);
  }
});

app.put('/api/settings', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userSettings = req.body;
    
    for (const [key, value] of Object.entries(userSettings)) {
      const existingIndex = settings.findIndex(s => s.userId === decoded.id && s.setting_key === key);
      if (existingIndex !== -1) {
        settings[existingIndex].setting_value = value.toString();
      } else {
        settings.push({ id: getNextId(), userId: decoded.id, setting_key: key, setting_value: value.toString() });
      }
    }
    res.json({ message: 'Settings saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DASHBOARD ROUTES ============
app.get('/api/dashboard/monthly', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const result = [];
    for (let i = 1; i <= 12; i++) {
      const monthIncome = income.filter(inc => inc.userId === decoded.id && new Date(inc.date).getMonth() + 1 === i && new Date(inc.date).getFullYear() === year).reduce((sum, inc) => sum + inc.amount, 0);
      const monthExpenses = expenses.filter(exp => exp.userId === decoded.id && new Date(exp.date).getMonth() + 1 === i && new Date(exp.date).getFullYear() === year).reduce((sum, exp) => sum + exp.amount, 0);
      result.push({ month: months[i - 1], month_num: i, income: monthIncome, expenses: monthExpenses, savings: monthIncome - monthExpenses });
    }
    res.json(result);
  } catch (error) {
    res.json([]);
  }
});

app.get('/api/dashboard/annual', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ total_income: 0, total_expenses: 0 });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const total_income = income.filter(inc => inc.userId === decoded.id && new Date(inc.date).getFullYear() === year).reduce((sum, inc) => sum + inc.amount, 0);
    const total_expenses = expenses.filter(exp => exp.userId === decoded.id && new Date(exp.date).getFullYear() === year).reduce((sum, exp) => sum + exp.amount, 0);
    
    res.json({ total_income, total_expenses });
  } catch (error) {
    res.json({ total_income: 0, total_expenses: 0 });
  }
});

app.get('/api/expenses/categories', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json([]);
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const categoryTotals = {};
    expenses.filter(exp => exp.userId === decoded.id && new Date(exp.date).getMonth() + 1 === month && new Date(exp.date).getFullYear() === year).forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    res.json(Object.entries(categoryTotals).map(([category, total]) => ({ category, total })));
  } catch (error) {
    res.json([]);
  }
});

// ============ REPORT ROUTES ============
app.get('/api/reports/financial', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ total_income: 0, total_expenses: 0, net_savings: 0, categories: [] });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const year = new Date().getFullYear();
    
    const total_income = income.filter(inc => inc.userId === decoded.id && new Date(inc.date).getFullYear() === year).reduce((sum, inc) => sum + inc.amount, 0);
    const total_expenses = expenses.filter(exp => exp.userId === decoded.id && new Date(exp.date).getFullYear() === year).reduce((sum, exp) => sum + exp.amount, 0);
    
    const categoryTotals = {};
    expenses.filter(exp => exp.userId === decoded.id && new Date(exp.date).getFullYear() === year).forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    res.json({
      period: 'year',
      total_income,
      total_expenses,
      net_savings: total_income - total_expenses,
      categories: Object.entries(categoryTotals).map(([category, total]) => ({ category, total }))
    });
  } catch (error) {
    res.json({ total_income: 0, total_expenses: 0, net_savings: 0, categories: [] });
  }
});

app.get('/api/reports/support', (req, res) => {
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

app.listen(PORT, () => {
  console.log('FinovaTrack Server running on port ' + PORT);
});
