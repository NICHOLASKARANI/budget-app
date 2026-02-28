import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>
          ✅ Budget Tracker App
        </h1>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>
          React is working correctly!
        </p>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          Ready to add your budget components
        </p>
      </div>
    </div>
  );
}

export default App;
