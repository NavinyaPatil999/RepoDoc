import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Hero / Stat banner skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Filter / Tabs Skeleton */}
      <div className="h-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4">
        <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Patient Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

