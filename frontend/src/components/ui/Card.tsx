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
    icon: 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/50 dark:border-blue-800/60 dark:text-blue-400 shadow-2xs',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/50 dark:border-amber-800/60 dark:text-amber-400 shadow-2xs',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/50 dark:border-emerald-800/60 dark:text-emerald-400 shadow-2xs',
  },
  red: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    icon: 'bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:border-rose-800/60 dark:text-rose-400 shadow-2xs',
  },
};

export function StatCard({ title, value, icon, color, subtitle, delay = 0 }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="card p-5.5 cursor-default flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-2xl sm:text-3xl font-extrabold mt-1.5 tracking-tight ${colors.text}`}>{value}</p>
          {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
