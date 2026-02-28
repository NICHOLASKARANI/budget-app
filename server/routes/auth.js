import express from 'express';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working!' });
});

// Register route (simplified for testing)
router.post('/register', (req, res) => {
  const { username, email, password, currency } = req.body;
  res.json({ 
    message: 'Registration endpoint working',
    data: { username, email, currency }
  });
});

// Login route (simplified for testing)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ 
    message: 'Login endpoint working',
    token: 'test-token-12345',
    user: { id: 1, username: 'testuser', email, currency: 'USD' }
  });
});

// Get current user
router.get('/me', (req, res) => {
  res.json({ 
    id: 1, 
    username: 'testuser', 
    email: 'test@example.com', 
    currency: 'USD' 
  });
});

export default router;
