const express = require('express');
const app = express();
const port = 5000;

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

const server = app.listen(port, 'localhost', () => {
  console.log(Test server running at http://localhost:/test);
});

// Log any errors
server.on('error', (err) => {
  console.error('Server error:', err);
});
