const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const sql = neon(process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL);

// Configure CORS
app.use(cors({
  origin: ['https://finovatrack.com', 'https://budget-app-client-lyart.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Email transporter configuration (using Ethereal for testing, replace with real SMTP)
let transporter;
try {
  // For production, use your email service
  // For now, create an Ethereal test account
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASS || 'testpass'
    }
  });
  console.log('Email transporter configured');
} catch (error) {
  console.log('Email not configured, using console fallback');
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Helper to send email
const sendEmail = async (to, subject, html) => {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"FinovaTrack" <noreply@finovatrack.com>',
        to,
        subject,
        html
      });
      return { success: true, messageId: info.messageId };
    } else {
      console.log([EMAIL] To: , Subject: );
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, currency } = req.body;
    
    const userExists = await sql('SELECT * FROM users WHERE email =  OR username = ', [email, username]);
    
    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const newUser = await sql(
      'INSERT INTO users (username, email, password_hash, currency) VALUES (, , , ) RETURNING id, username, email, currency',
      [username, email, password_hash, currency || 'USD']
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
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await sql('SELECT * FROM users WHERE email = ', [email]);
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
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

// Forgot Password - Send OTP
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await sql('SELECT * FROM users WHERE email = ', [email]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    
    otpStore.set(email, { otp, expiresAt });
    
    // Send OTP via email
    const html = 
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #4f46e5; width: 50px; height: 50px; border-radius: 12px; text-align: center; line-height: 50px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">F</span>
          </div>
          <h1 style="color: #1f2937; margin-top: 10px;">FinovaTrack</h1>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #4b5563;">Hello,</p>
          <p style="color: #4b5563;">We received a request to reset your password for your FinovaTrack account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #f3f4f6; padding: 15px 30px; border-radius: 12px; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #4f46e5;">
              
            </div>
          </div>
          
          <p style="color: #4b5563;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #4b5563;">If you didn't request this, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">FinovaTrack - Smart Financial Management</p>
        </div>
      </div>
    ;
    
    await sendEmail(email, 'Password Reset Request - FinovaTrack', html);
    
    res.json({ message: 'OTP sent to your email', expiresIn: 600 });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    const stored = otpStore.get(email);
    
    if (!stored) {
      return res.status(400).json({ error: 'No OTP request found' });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { email, purpose: 'reset-password' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );
    
    res.json({ 
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ error: 'Invalid token purpose' });
    }
    
    const { email } = decoded;
    
    const user = await sql('SELECT * FROM users WHERE email = ', [email]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    await sql('UPDATE users SET password_hash =  WHERE email = ', [newPasswordHash, email]);
    
    // Clear OTP store
    otpStore.delete(email);
    
    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await sql('SELECT id, username, email, currency FROM users WHERE id = ', [req.user.id]);
    if (user.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

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

// ... rest of your routes (income, expenses, budgets, etc.)

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
