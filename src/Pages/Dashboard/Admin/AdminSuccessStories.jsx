import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaTimesCircle, FaRegEye } from 'react-icons/fa';
import { Navigate, useOutletContext } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All Stories' },
];

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => {
  const normalized = status || 'pending';
  const style = STATUS_COLORS[normalized] || 'bg-gray-100 text-gray-700';
  const label = STATUS_OPTIONS.find((option) => option.value === normalized)?.label || 'Pending Review';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {normalized === 'approved' && <FaCheckCircle className="text-sm" />}
      {normalized === 'pending' && <FaClock className="text-sm" />}
      {normalized === 'rejected' && <FaTimesCircle className="text-sm" />}
      {normalized === 'under_review' && <FaRegEye className="text-sm" />}
      {label}
    </span>
  );
};

const StoryHeader = ({ story }) => {
  const formattedDate = story.marriageDate
    ? new Date(story.marriageDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Awaiting date';

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">{story.coupleNames || 'Porinity Couple'}</h3>
        <p className="text-xs text-[var(--color-medium-gray)]">
          Shared by {story.submittedBy?.name || 'Anonymous'} • {story.submittedBy?.email || 'Contact unavailable'}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <StatusBadge status={story.status} />
        <p className="text-xs font-medium text-[var(--color-medium-gray)]">Wedding Date: {formattedDate}</p>
      </div>
    </div>
  );
};

export default function AdminSuccessStories() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { isAdmin } = useOutletContext() || {};

  const { data: stories = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'success-stories', statusFilter],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/success-stories', {
        params: { status: statusFilter },
      });
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30_000,
    enabled: Boolean(isAdmin),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, nextStatus, note }) => {
      const { data } = await axiosSecure.patch(`/admin/success-stories/${id}/status`, {
        status: nextStatus,
        adminNote: note || undefined,
      });
      return data;
    },
    onMutate: async ({ id, nextStatus }) => {
      const currentFilter = statusFilter;
      const queryKey = ['admin', 'success-stories', currentFilter];

      await queryClient.cancelQueries({ queryKey });

      const previousStories = queryClient.getQueryData(queryKey);

      if (Array.isArray(previousStories)) {
        const nowIso = new Date().toISOString();
        const updatedStories = currentFilter === 'all'
          ? previousStories.map((story) =>
              story.id === id
                ? {
                    ...story,
                    status: nextStatus,
                    updatedAt: nowIso,
                    approvedAt: nextStatus === 'approved' ? nowIso : null,
                  }
                : story
            )
          : previousStories.filter((story) => story.id !== id);

        queryClient.setQueryData(queryKey, updatedStories);
      }

      return { previousStories, queryKey, optimisticApplied: Array.isArray(previousStories) };
    },
    onError: (err, variables, context) => {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 404 && message === 'Success story not found') {
        toast.info('This story was already processed. Refreshing the latest submissions.');
        if (context?.queryKey) {
          queryClient.invalidateQueries({ queryKey: context.queryKey });
        }
        queryClient.invalidateQueries({ queryKey: ['admin', 'success-stories'] });
        queryClient.invalidateQueries({ queryKey: ['success-stories'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
        return;
      }

      if (context?.previousStories && context?.queryKey && context.optimisticApplied) {
        queryClient.setQueryData(context.queryKey, context.previousStories);
      }

      toast.error(message || 'Unable to update story status');
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Success story updated');
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'success-stories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
    },
  });

  const handleStatusChange = async (story, nextStatus) => {
    if (!story?.id || story.status === nextStatus) return;
    await updateStatus.mutateAsync({ id: story.id, nextStatus });
  };

  const groupedStories = useMemo(() => {
    if (!stories.length || statusFilter === 'all') return { all: stories };
    return {
      [statusFilter]: stories,
    };
  }, [stories, statusFilter]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Success Stories Moderation</h1>
          <p className="text-sm text-[var(--color-medium-gray)]">
            Review community submissions and publish those aligned with Porinity values.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-[var(--color-primary)]" htmlFor="story-status-filter">
            Filter by status
          </label>
          <select
            id="story-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-[var(--color-primary)]/30 bg-white px-3 py-2 text-sm text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-300">
          Failed to load success stories {error?.message && <span>({error.message})</span>}
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="h-48 animate-pulse rounded-2xl bg-[var(--color-bg-light)]/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedStories).map(([groupKey, groupStories]) => (
            <article key={groupKey} className="space-y-4">
              {statusFilter === 'all' && (
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                  {STATUS_OPTIONS.find((option) => option.value === groupKey)?.label || groupKey}
                </h2>
              )}

              {!groupStories.length ? (
                <p className="rounded-xl bg-[var(--color-bg-light)]/80 px-4 py-3 text-sm text-[var(--color-medium-gray)]">
                  No stories in this state.
                </p>
              ) : (
                <div className="space-y-5">
                  {groupStories.map((story) => (
                    <div
                      key={story.id}
                      className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-white/90 p-5 shadow-sm transition hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900/60"
                    >
                      <StoryHeader story={story} />

                      <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed text-[var(--color-dark-gray)] dark:text-gray-200">
                            {story.story}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">
                            Rating: <span className="font-semibold text-[var(--color-primary)]">{story.rating || 5}/5</span>
                          </p>
                          {story.adminNote && (
                            <p className="rounded-lg bg-[var(--color-bg-light)]/70 px-3 py-2 text-xs text-[var(--color-medium-gray)]">
                              Admin Note: {story.adminNote}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl bg-[var(--color-bg-light)]/70 p-4 dark:bg-gray-800/60">
                          <h4 className="text-sm font-semibold text-[var(--color-primary)]">Submission Details</h4>
                          <ul className="space-y-2 text-xs text-[var(--color-medium-gray)]">
                            <li>
                              Submitted: {story.createdAt ? new Date(story.createdAt).toLocaleString() : 'Unknown'}
                            </li>
                            <li>
                              Last Updated: {story.updatedAt ? new Date(story.updatedAt).toLocaleString() : 'Pending'}
                            </li>
                            {story.submittedBy?.phone && <li>Phone: {story.submittedBy.phone}</li>}
                            {story.weddingCity && <li>Wedding City: {story.weddingCity}</li>}
                          </ul>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(story, 'under_review')}
                              className="rounded-full border border-[var(--color-primary)]/40 px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10 disabled:opacity-60"
                              disabled={updateStatus.isLoading}
                            >
                              Mark Reviewing
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(story, 'approved')}
                              className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                              disabled={updateStatus.isLoading}
                            >
                              Approve & Publish
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(story, 'rejected')}
                              className="rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                              disabled={updateStatus.isLoading}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
