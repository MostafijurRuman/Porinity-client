import React, { useMemo, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiUserCheck, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

export default function AdminManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { isAdmin } = useOutletContext() || {};

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'users', { searchQuery, page }],
    queryFn: async () => {
      const { data: response } = await axiosSecure.get('/admin/users', {
        params: { search: searchQuery, page },
      });
      return response;
    },
    enabled: Boolean(isAdmin),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const rows = useMemo(() => data?.data || [], [data?.data]);
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const promoteAdminMutation = useMutation({
    mutationFn: async (uid) => {
      const { data: response } = await axiosSecure.post(`/admin/users/${uid}/make-admin`);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'User promoted to admin');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to promote user';
      toast.error(message);
    },
  });

  const promotePremiumMutation = useMutation({
    mutationFn: async (uid) => {
      const { data: response } = await axiosSecure.post(`/admin/users/${uid}/make-premium`);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'User promoted to premium');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'premium-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to promote user';
      toast.error(message);
    },
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Manage Users</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Promote members to admins or approve premium privileges after reviewing their requests.
        </p>
      </header>

      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 rounded-2xl border border-[var(--color-light-purple)]/30 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-light-purple)]/40 bg-[var(--color-bg-light)] px-3 py-2">
          <FiSearch className="h-4 w-4 text-[var(--color-primary)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by user name or email"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-light-purple)]"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30 text-sm">
          <thead className="bg-[var(--color-bg-light)]/70 text-[var(--color-medium-gray)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Premium Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20 text-[var(--color-dark-gray)]">
            {rows.length === 0 && !isLoading && !isFetching && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  No users found. Try adjusting your search.
                </td>
              </tr>
            )}

            {rows.map((row) => {
              const isAlreadyAdmin = row.role === 'admin';
              const premiumStatus = row.premiumStatus || 'none';
              const isPremiumApproved = premiumStatus === 'approved';
              const isPremiumPending = premiumStatus === 'pending';

              return (
                <tr key={row.uid}>
                  <td className="px-4 py-3 font-medium">
                    {row.displayName || '—'}
                    <p className="text-xs text-[var(--color-medium-gray)]">UID: {row.uid}</p>
                  </td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3 capitalize">{row.role || 'user'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isPremiumApproved
                          ? 'bg-emerald-100 text-emerald-600'
                          : isPremiumPending
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-[var(--color-bg-light)] text-[var(--color-medium-gray)]'
                      }`}
                    >
                      <FiAward className="h-3 w-3" /> {premiumStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => promoteAdminMutation.mutate(row.uid)}
                        disabled={promoteAdminMutation.isPending || isAlreadyAdmin}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiUserCheck className="h-4 w-4" /> Make Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => promotePremiumMutation.mutate(row.uid)}
                        disabled={promotePremiumMutation.isPending || isPremiumApproved || !isPremiumPending}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-600 transition hover:bg-amber-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiAward className="h-4 w-4" /> Make Premium
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  Loading users…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--color-medium-gray)]">
        <p>
          Page {pagination.page} of {pagination.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={pagination.page <= 1}
            className="rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages || prev + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className="rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
