const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Budget Tracker API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    time: new Date().toISOString(),
    message: 'Server is working!'
  });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Test at: http://localhost:' + PORT + '/api/health');
});
