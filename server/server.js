const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Budget Tracker API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      login: '/api/auth/login',
      register: '/api/auth/register'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: 'connected', 
    timestamp: new Date().toISOString(),
    message: 'Server is working correctly!'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Mock login - accept any credentials for testing
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 1,
      username: email.split('@')[0],
      email: email,
      currency: 'USD'
    }
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, currency } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  res.json({
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 1,
      username: username,
      email: email,
      currency: currency || 'USD'
    }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Mock user data
  res.json({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    currency: 'USD'
  });
});

// Income endpoints
app.get('/api/income', (req, res) => {
  res.json([]);
});

app.post('/api/income', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

// Expenses endpoints
app.get('/api/expenses', (req, res) => {
  res.json([]);
});

app.post('/api/expenses', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

// Budgets endpoints
app.get('/api/budgets', (req, res) => {
  res.json([]);
});

app.post('/api/budgets', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

// Goals endpoints
app.get('/api/goals', (req, res) => {
  res.json([]);
});

app.post('/api/goals', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

// Subscriptions endpoints
app.get('/api/subscriptions', (req, res) => {
  res.json([]);
});

app.post('/api/subscriptions', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

// Net worth endpoints
app.get('/api/networth/assets', (req, res) => {
  res.json([]);
});

app.post('/api/networth/assets', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

app.get('/api/networth/liabilities', (req, res) => {
  res.json([]);
});

app.post('/api/networth/liabilities', (req, res) => {
  res.json({ id: Date.now(), ...req.body });
});

app.get('/api/networth', (req, res) => {
  res.json([]);
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  res.json([]);
});

app.put('/api/settings', (req, res) => {
  res.json({ message: 'Settings saved' });
});

// Dashboard endpoints
app.get('/api/dashboard/monthly', (req, res) => {
  res.json([
    { month: 'January', income: 5000, expenses: 4200 },
    { month: 'February', income: 5200, expenses: 4300 },
    { month: 'March', income: 4800, expenses: 4100 }
  ]);
});

app.get('/api/dashboard/annual', (req, res) => {
  res.json({ total_income: 15000, total_expenses: 12600 });
});

app.get('/api/expenses/categories', (req, res) => {
  res.json([
    { category: 'Housing', total: 12000 },
    { category: 'Food', total: 4800 },
    { category: 'Transport', total: 3200 }
  ]);
});

// Reports endpoints
app.get('/api/reports/financial', (req, res) => {
  res.json({
    period: 'year',
    total_income: 50000,
    total_expenses: 35000,
    net_savings: 15000,
    categories: [
      { category: 'Housing', total: 12000 },
      { category: 'Food', total: 8000 }
    ]
  });
});

app.get('/api/reports/support', (req, res) => {
  res.json({
    period: 'monthly',
    total_tickets: 234,
    avg_response_time: 1.3,
    avg_resolution_time: 4.5,
    csat_score: 94,
    common_issues: [
      { issue: 'Login Problems', count: 45 },
      { issue: 'Payment Failed', count: 38 }
    ]
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
