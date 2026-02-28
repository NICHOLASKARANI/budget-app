import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Welcome back, {user?.username}!
          </h1>
          
          <div style={{ position: 'relative' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserCircleIcon style={{ height: '2rem', width: '2rem', color: '#9ca3af' }} />
              <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' }, fontSize: '0.875rem', color: '#374151' }}>
                {user?.email}
              </span>
            </button>
            
            <div style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <button
                onClick={() => window.location.href = '/settings'}
                style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151' }}
              >
                <Cog6ToothIcon style={{ marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                Settings
              </button>
              <button
                onClick={logout}
                style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151' }}
              >
                <ArrowLeftOnRectangleIcon style={{ marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
