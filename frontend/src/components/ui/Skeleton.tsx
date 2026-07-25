import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function ClaimCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
