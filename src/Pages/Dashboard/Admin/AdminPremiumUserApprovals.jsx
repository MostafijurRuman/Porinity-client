import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Navigate, useOutletContext } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

export default function AdminPremiumUserApprovals() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isAdmin } = useOutletContext() || {};

  const {
    data: requests = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin', 'premium-user-requests'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/premium-user-requests');
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(isAdmin),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (isError) {
      console.error('Failed to load premium user requests', error);
      toast.error('Failed to load premium user requests');
    }
  }, [isError, error]);

  const approveMutation = useMutation({
    mutationFn: async (uid) => {
      const { data } = await axiosSecure.post(`/admin/premium-user-requests/${uid}/approve`);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Premium user approved');
      queryClient.invalidateQueries({ queryKey: ['admin', 'premium-user-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to approve premium user';
      toast.error(message);
    },
  });

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
  <h2 className="text-2xl font-bold text-[var(--color-primary)]">Approve Premium Users ($50)</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Each approved premium membership adds <strong>$50.00 USD</strong> of revenue and unlocks full platform access for the user.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30 text-sm">
          <thead className="bg-[var(--color-bg-light)]/70 text-[var(--color-medium-gray)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Payment</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Requested At</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20 text-[var(--color-dark-gray)]">
            {requests.length === 0 && !isLoading && !isFetching && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  No pending premium user requests.
                </td>
              </tr>
            )}

            {requests.map((item) => (
              <tr key={item.uid}>
                <td className="px-4 py-3 font-medium">{item.displayName || '—'}</td>
                <td className="px-4 py-3">{item.email || '—'}</td>
                <td className="px-4 py-3">
                  {typeof item.amount === 'number'
                    ? `$${item.amount.toFixed(2)} ${item.currency || 'USD'}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-medium-gray)]">
                  {item.requestedAt ? new Date(item.requestedAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(item.uid)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiAward className="h-4 w-4" /> Approve ($50)
                  </button>
                </td>
              </tr>
            ))}

            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  Loading premium user requests…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
