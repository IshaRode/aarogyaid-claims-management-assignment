import React from 'react';
import { motion } from 'framer-motion';
import { ClaimStatus } from '../../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ClaimStatus;
  size?: 'sm' | 'md';
}

const config = {
  Pending: {
    className: 'badge-pending',
    icon: Clock,
    label: 'Pending',
  },
  Approved: {
    className: 'badge-approved',
    icon: CheckCircle,
    label: 'Approved',
  },
  Rejected: {
    className: 'badge-rejected',
    icon: XCircle,
    label: 'Rejected',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { className, icon: Icon, label } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-3 py-1 gap-1.5';

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full ${className} ${sizeClass}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {label}
    </motion.span>
  );
}
