import type { ClaimStatus, RiskLevel } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskLevel(amount: number): RiskLevel {
  if (amount < 10000) return 'Low';
  if (amount <= 50000) return 'Medium';
  return 'High';
}

export function getStatusColor(status: ClaimStatus): string {
  switch (status) {
    case 'Approved': return 'badge-approved';
    case 'Rejected': return 'badge-rejected';
    default: return 'badge-pending';
  }
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Low': return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
    case 'Medium': return 'text-amber-600 bg-amber-50 border border-amber-200';
    case 'High': return 'text-red-600 bg-red-50 border border-red-200';
  }
}

export function truncate(str: string, length = 100): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function generateClaimId(id: string): string {
  return `CLM-${id.slice(-6).toUpperCase()}`;
}

export function isImageFile(url: string): boolean {
  return /\.(jpg|jpeg|png)$/i.test(url);
}

export function isPdfFile(url: string): boolean {
  return /\.pdf$/i.test(url);
}
