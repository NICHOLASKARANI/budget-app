const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL);

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, currency } = req.body;
    
    // Check if user exists
    const userExists = await sql('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    
    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = await sql(
      'INSERT INTO users (username, email, password_hash, currency) VALUES ($1, $2, $3, $4) RETURNING id, username, email, currency',
      [username, email, password_hash, currency || 'USD']
    );
    
    // Create default settings
    await sql(
      'INSERT INTO settings (user_id, setting_key, setting_value) VALUES ($1, $2, $3), ($1, $4, $5), ($1, $6, $7)',
      [newUser[0].id, 'year', new Date().getFullYear().toString(), 'starting_balance', '0', 'pay_frequency', 'Monthly']
    );
    
    const token = jwt.sign(
      { id: newUser[0].id, username: newUser[0].username },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    res.json({ token, user: newUser[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await sql('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user[0].id, username: user[0].username },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    res.json({
      token,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        currency: user[0].currency
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ SETTINGS ROUTES ============
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await sql('SELECT setting_key, setting_value FROM settings WHERE user_id = $1', [req.user.id]);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sql('SELECT 1');
    res.json({ 
      status: 'healthy', 
      database: 'connected', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.json({ 
      status: 'healthy', 
      database: 'disconnected', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Premium Budget API is running!' });
});

app.listen(PORT, () => {
  console.log(`Premium Budget App server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});