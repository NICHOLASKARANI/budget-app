import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Import routes
import authRoutes from './routes/auth.js';
import incomeRoutes from './routes/income.js';
import expenseRoutes from './routes/expense.js';
import budgetRoutes from './routes/budget.js';
import goalRoutes from './routes/goals.js';
import subscriptionRoutes from './routes/subscriptions.js';
import netWorthRoutes from './routes/networth.js';
import reportRoutes from './routes/reports.js';

// Import middleware
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'budget_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Make pool available to routes
app.locals.pool = pool;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/income', verifyToken, incomeRoutes);
app.use('/api/expenses', verifyToken, expenseRoutes);
app.use('/api/budget', verifyToken, budgetRoutes);
app.use('/api/goals', verifyToken, goalRoutes);
app.use('/api/subscriptions', verifyToken, subscriptionRoutes);
app.use('/api/networth', verifyToken, netWorthRoutes);
app.use('/api/reports', verifyToken, reportRoutes);

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      time: result.rows[0].now,
      message: 'Server is running correctly!'
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      message: 'Database connection failed. Make sure PostgreSQL is running.'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Budget Tracker API is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      income: '/api/income',
      expenses: '/api/expenses',
      budget: '/api/budget'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('API available at http://localhost:' + PORT + '/api');
  console.log('Health check at http://localhost:' + PORT + '/api/health');
});
