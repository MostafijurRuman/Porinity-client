import React from 'react';

export default function BiodataGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-[var(--color-light-purple)]/30 bg-white/70 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-[var(--color-bg-light)]" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-[var(--color-bg-light)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--color-bg-light)]" />
              <div className="h-3 w-3/5 rounded bg-[var(--color-bg-light)]" />
              <div className="h-3 w-2/5 rounded bg-[var(--color-bg-light)]" />
            </div>
          </div>
          <div className="mt-6 h-9 w-full rounded-full bg-[var(--color-bg-light)]" />
        </div>
      ))}
    </div>
  );
}
