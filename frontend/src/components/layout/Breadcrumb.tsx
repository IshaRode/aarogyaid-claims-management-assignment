import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to="/"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-200 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
