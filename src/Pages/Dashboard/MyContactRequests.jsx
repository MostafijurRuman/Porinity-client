import React, { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/UseAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const statusBadgeClasses = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function MyContactRequests() {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const uid = user?.uid;
  const navigate = useNavigate();

  const {
    data: requests = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['contactRequests', uid],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/contact-requests', {
        params: { requesterUid: uid },
      });
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(uid),
  });

  const deleteMutation = useMutation({
    mutationFn: async (requestId) => {
      await axiosSecure.delete(`/contact-requests/${requestId}`);
    },
    onSuccess: () => {
      toast.success('Contact request removed');
      refetch();
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to remove contact request';
      toast.error(message);
    },
  });

  const rows = useMemo(
    () =>
      requests.map((item) => ({
        id: item.id || item._id,
        name: item.name,
        biodataId: item.biodataId,
        status: item.status,
        contactEmail: item.contactEmail,
        mobileNumber: item.mobileNumber,
      })),
    [requests]
  );

  const handleDelete = async (requestId) => {
    if (!requestId) return;
    if (deleteMutation.isPending) return;

    const result = await Swal.fire({
      title: 'Remove contact request?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it',
    });

    if (!result.isConfirmed) return;
    deleteMutation.mutate(requestId);
  };

  return (
    <div className="space-y-5">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">My Contact Requests</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Track the status of all contact information requests. Approved requests will reveal email and phone details.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30">
          <thead className="bg-[var(--color-bg-light)]/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Biodata ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Mobile No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Email
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20">
            {rows.length === 0 && !isLoading && !isFetching && (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--color-medium-gray)]" colSpan={6}>
                  No contact requests yet. Submit a request from a biodata to see approvals here.
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-dark-gray)]">{row.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">{row.biodataId}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statusBadgeClasses[row.status] || 'bg-[var(--color-bg-light)] text-[var(--color-primary)]'
                    }`}
                  >
                    {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">
                  {row.status === 'approved' ? row.mobileNumber || 'Not provided' : '--'}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">
                  {row.status === 'approved' ? row.contactEmail || 'Not provided' : '--'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/biodatas/${row.biodataId}`)}
                      disabled={row.status !== 'approved'}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiEye /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={deleteMutation.isPending}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {(isLoading || isFetching) && (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--color-medium-gray)]" colSpan={6}>
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
