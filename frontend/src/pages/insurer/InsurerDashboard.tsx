
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, IndianRupee, ArrowRight } from 'lucide-react';
import { claimsService } from '../../services/claims.service';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatCardSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate, generateClaimId } from '../../utils/helpers';
import type { Claim } from '../../types';
import { useAuth } from '../../context/AuthContext';

export function InsurerDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['insurer-stats'],
    queryFn: claimsService.getStats,
  });

  const { data: claims, isLoading: claimsLoading } = useQuery({
    queryKey: ['all-claims'],
    queryFn: () => claimsService.getAllClaims({ sort: 'newest' }),
  });

  const recentPending = claims?.filter((c) => c.status === 'Pending').slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-900 dark:text-white"
          >
            Good morning, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {recentPending.length > 0
              ? `${recentPending.length} claims awaiting your review.`
              : 'All claims are reviewed. Great work!'}
          </p>
        </div>
        <Link to="/insurer/claims">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
            View All Claims <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsLoading ? (
          Array(5).fill(null).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Total Claims" value={stats?.total ?? 0} icon={<FileText className="w-5 h-5" />} color="blue" delay={0} />
            <StatCard title="Pending Review" value={stats?.pending ?? 0} icon={<Clock className="w-5 h-5" />} color="amber" delay={0.05} />
            <StatCard title="Approved" value={stats?.approved ?? 0} icon={<CheckCircle className="w-5 h-5" />} color="green" delay={0.1} />
            <StatCard title="Rejected" value={stats?.rejected ?? 0} icon={<XCircle className="w-5 h-5" />} color="red" delay={0.15} />
            <StatCard
              title="Total Approved"
              value={formatCurrency(stats?.totalApprovedAmount ?? 0)}
              icon={<IndianRupee className="w-5 h-5" />}
              color="blue"
              delay={0.2}
              subtitle="Amount disbursed"
            />
          </>
        )}
      </div>

      {/* Pending Claims */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Pending Review</h2>
          <Link to="/insurer/claims?status=Pending" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {claimsLoading ? (
          <TableSkeleton rows={4} />
        ) : recentPending.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">All caught up!</h3>
            <p className="text-sm text-slate-400 mt-1">No pending claims require your attention.</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {['Claim ID', 'Patient', 'Amount', 'Status', 'Date', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {recentPending.map((claim: Claim, i: number) => (
                    <motion.tr
                      key={claim._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                          {generateClaimId(claim._id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{claim.patientName}</p>
                          <p className="text-xs text-slate-400">{claim.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {formatCurrency(claim.claimAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(claim.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/insurer/review/${claim._id}`}>
                          <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Review
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
    </div>
  );
}
