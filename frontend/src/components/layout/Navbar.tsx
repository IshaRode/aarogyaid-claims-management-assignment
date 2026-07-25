import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, Bell, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const roleLabel = user?.role === 'insurer' ? 'Insurer Portal' : 'Patient Portal';
  const roleColor = user?.role === 'insurer'
    ? 'text-purple-700 bg-purple-50 border border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50 font-semibold'
    : 'text-blue-700 bg-blue-50 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 font-semibold';

  return (
    <header className="sticky top-0 z-40 glass border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_4px_0_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8.5 h-8.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Aarogya<span className="text-blue-600">ID</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Role badge */}
            <span className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full ${roleColor}`}>
              {roleLabel}
            </span>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/60 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
            </motion.button>

            {/* Notification bell (decorative) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/60 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900" />
            </motion.button>

            {/* User avatar + logout */}
            <div className="flex items-center gap-1.5 ml-1">
              <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-default">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 dark:border-slate-800 dark:hover:bg-rose-950/40 transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
