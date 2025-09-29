'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'New user registered', time: '2 min ago', unread: true },
    { id: 2, title: 'System update completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Weekly report ready', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-20 flex-shrink-0 items-center gap-x-4 border-b border-gray-800 bg-black px-6 shadow-lg lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-8 w-px bg-gray-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 justify-end gap-x-6">
        {/* Right side content only */}

        <div className="flex items-center gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <span className="sr-only">Toggle theme</span>
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200 relative"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 z-10 mt-3 w-80 origin-top-right rounded-xl bg-gray-950 border border-gray-800 shadow-2xl focus:outline-none">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          notification.unread
                            ? 'bg-blue-900/20 border border-blue-500/30'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${notification.unread ? 'text-white font-medium' : 'text-gray-300'}`}>
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center p-2 hover:bg-gray-800 rounded-xl transition-all duration-200"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                  {user?.name || 'User'}
                </span>
              </span>
            </button>

            {/* Profile dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-xl bg-gray-950 border border-gray-800 shadow-2xl focus:outline-none">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-700 mb-2">
                    <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>

                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Your Profile
                  </a>

                  <a
                    href="/dashboard/settings"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Settings
                  </a>

                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}