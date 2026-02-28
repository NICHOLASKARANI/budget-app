import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, LogoutIcon } from '@heroicons/react/outline';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.username}!
          </h2>
          
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 focus:outline-none">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{user?.email}</span>
            </Menu.Button>
            
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700}
                    >
                      <LogoutIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
