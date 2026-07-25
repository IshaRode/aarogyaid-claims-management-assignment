import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, onClick, padding = 'md' }: CardProps) {
  const base = `card ${paddingMap[padding]} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.1)' }}
        transition={{ duration: 0.2 }}
        className={`${base} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'amber' | 'green' | 'red';
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-100 dark:ring-blue-900/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-100 dark:ring-amber-900/50',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-100 dark:ring-emerald-900/50',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-600 dark:text-red-400',
    icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    ring: 'ring-red-100 dark:ring-red-900/50',
  },
};

export function StatCard({ title, value, icon, color, subtitle, delay = 0 }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, boxShadow: '0 12px 28px -6px rgb(0 0 0 / 0.1)' }}
      className="card p-6 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
