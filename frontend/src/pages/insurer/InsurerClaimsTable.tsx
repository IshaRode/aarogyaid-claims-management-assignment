import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { claimsService } from '../../services/claims.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate, generateClaimId } from '../../utils/helpers';
import type { Claim } from '../../types';

const STATUS_OPTIONS = ['all', 'Pending', 'Approved', 'Rejected'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Amount' },
];

export function InsurerClaimsTable() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState('newest');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: claims, isLoading } = useQuery({
    queryKey: ['all-claims', search, status, sort, minAmount, maxAmount],
    queryFn: () =>
      claimsService.getAllClaims({
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        sort,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      }),
  });

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setSort('newest');
    setMinAmount('');
    setMaxAmount('');
  };

  const hasFilters = search || status !== 'all' || sort !== 'newest' || minAmount || maxAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Claims</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {claims ? `${claims.length} claim${claims.length !== 1 ? 's' : ''} found` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="search-claims"
              placeholder="Search by patient name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9 h-10"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              id="sort-claims"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-base h-10 pr-8 appearance-none cursor-pointer w-40"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2
              ${showFilters
                ? 'border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            {/* Status filter */}
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize
                    ${status === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Amount range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="input-base h-8 pl-6 pr-2 w-24 text-xs"
                />
              </div>
              <span className="text-slate-400 text-xs">to</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="input-base h-8 pl-6 pr-2 w-24 text-xs"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : !claims || claims.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No claims found</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  {['Claim ID', 'Patient', 'Amount', 'Status', 'Risk', 'Date', 'Action'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {claims.map((claim: Claim, i: number) => (
                  <motion.tr
                    key={claim._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
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
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border
                        ${claim.riskLevel === 'Low'
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400'
                          : claim.riskLevel === 'Medium'
                          ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400'
                          : 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400'
                        }`}>
                        {claim.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(claim.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/insurer/review/${claim._id}`}>
                        <button
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                          ${claim.status === 'Pending'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {claim.status === 'Pending' ? 'Review' : 'View'}
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
  );
}
