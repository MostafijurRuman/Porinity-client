import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiPhoneCall } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Navigate, useOutletContext } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

export default function AdminContactApprovals() {
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
    queryKey: ['admin', 'contact-requests'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/contact-requests');
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(isAdmin),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (isError) {
      console.error('Failed to load contact requests', error);
      toast.error('Failed to load contact requests');
    }
  }, [isError, error]);

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.post(`/admin/contact-requests/${id}/approve`);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Contact request approved');
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to approve contact request';
      toast.error(message);
    },
  });

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Approved Contact Request</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Approve members who purchased contact information so they gain access instantly.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30 text-sm">
          <thead className="bg-[var(--color-bg-light)]/70 text-[var(--color-medium-gray)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Biodata ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Amount Paid</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20 text-[var(--color-dark-gray)]">
            {requests.length === 0 && !isLoading && !isFetching && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  No pending contact requests.
                </td>
              </tr>
            )}

            {requests.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium">{item.name || '—'}</td>
                <td className="px-4 py-3">{item.email || '—'}</td>
                <td className="px-4 py-3">{item.biodataId}</td>
                <td className="px-4 py-3 text-xs text-[var(--color-medium-gray)]">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: item.currency || 'USD',
                    maximumFractionDigits: 0,
                  }).format(item.amount || 0)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(item.id)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiPhoneCall className="h-4 w-4" /> Approve Contact
                  </button>
                </td>
              </tr>
            ))}

            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  Loading contact requests…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
