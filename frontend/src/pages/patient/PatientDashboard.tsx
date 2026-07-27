
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, Plus, ArrowRight, TrendingUp,
} from 'lucide-react';
import { claimsService } from '../../services/claims.service';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { StatCardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate, generateClaimId } from '../../utils/helpers';
import type { Claim } from '../../types';

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-blue-50 text-blue-600 border border-blue-200/70 dark:bg-blue-950/40 dark:border-blue-800/60 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
        <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">No claims yet</h3>
      <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-xs text-sm font-medium">
        Submit your first insurance claim to get started. Our AI will analyze your document instantly.
      </p>
      <Link to="/patient/submit" className="mt-6">
        <Button icon={<Plus className="w-4 h-4" />}>Submit your first claim</Button>
      </Link>
    </motion.div>
  );
}

export function PatientDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: claimsService.getStats,
  });

  const { data: claims, isLoading: claimsLoading } = useQuery({
    queryKey: ['my-claims'],
    queryFn: claimsService.getMyClaims,
  });

  const recentClaims = claims?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Good morning, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Here's an overview of your insurance claims.
          </p>
        </div>
        <Link to="/patient/submit" className="w-full sm:w-auto shrink-0">
          <Button icon={<Plus className="w-4 h-4" />} size="md" className="w-full sm:w-auto justify-center shadow-md shadow-blue-500/20">
            New Claim
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array(4).fill(null).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Claims"
              value={stats?.total ?? 0}
              icon={<FileText className="w-5 h-5" />}
              color="blue"
              delay={0}
            />
            <StatCard
              title="Pending Review"
              value={stats?.pending ?? 0}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
              delay={0.05}
            />
            <StatCard
              title="Approved"
              value={stats?.approved ?? 0}
              icon={<CheckCircle className="w-5 h-5" />}
              color="green"
              delay={0.1}
            />
            <StatCard
              title="Rejected"
              value={stats?.rejected ?? 0}
              icon={<XCircle className="w-5 h-5" />}
              color="red"
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Recent Claims */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Recent Claims</h2>
          {claims && claims.length > 5 && (
            <Link to="/patient/claims" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {claimsLoading ? (
          <TableSkeleton rows={4} />
        ) : recentClaims.length === 0 ? (
          <div className="card">
            <EmptyState />
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Claim ID</th>
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Amount</th>
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Approved</th>
                    <th className="text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {recentClaims.map((claim: Claim, index: number) => (
                    <motion.tr
                      key={claim._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200/60 dark:border-slate-700">
                          {generateClaimId(claim._id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {formatCurrency(claim.claimAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {formatDate(claim.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/patient/claims/${claim._id}`}>
                          <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1 ml-auto">
                            View <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick tip card */}
      {stats && stats.pending > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/90 text-blue-900 border border-blue-200/80 shadow-2xs dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-200"
        >
          <TrendingUp className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">
            You have <strong className="font-bold">{stats.pending}</strong> pending {stats.pending === 1 ? 'claim' : 'claims'} under review. Our team typically responds within 24 hours.
          </p>
        </motion.div>
      )}
    </div>
  );
}
