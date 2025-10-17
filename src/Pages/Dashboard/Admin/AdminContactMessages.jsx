import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiCheckCircle, FiMail, FiPlay, FiRefreshCcw } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useAxiosSecure from '../../../Hooks/useAxiosSecure'

const statusFilters = [
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'All', value: 'all' },
]

const statusBadgeStyles = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-emerald-100 text-emerald-700'
    case 'in_progress':
      return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
    case 'new':
    default:
      return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
  }
}

const formatDateTime = (value) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch (err) {
    console.error('Failed to format date', err)
    return value
  }
}

const capitalize = (value) => {
  if (!value) return '—'
  const normalized = value.toString().replace(/_/g, ' ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export default function AdminContactMessages() {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { isAdmin } = useOutletContext() || {}
  const [statusFilter, setStatusFilter] = useState('new')

  const {
    data: messages = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin', 'contact-messages', statusFilter],
    queryFn: async () => {
      const params = statusFilter === 'all' ? { status: 'all' } : { status: statusFilter }
      const { data } = await axiosSecure.get('/admin/contact-messages', { params })
      return Array.isArray(data) ? data : []
    },
    enabled: Boolean(isAdmin),
    staleTime: 20 * 1000,
  })

  useEffect(() => {
    if (isError) {
      console.error('Failed to load contact messages', error)
      toast.error('Unable to load contact messages')
    }
  }, [isError, error])

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosSecure.patch(`/admin/contact-messages/${id}`, { status })
      return data
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Contact message updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] })
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to update contact message'
      toast.error(message)
    },
  })

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
      if (a.status === 'new') return -1
      if (b.status === 'new') return 1
      if (a.status === 'in_progress') return -1
      if (b.status === 'in_progress') return 1
      return 0
    })
  }, [messages])

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <div className="flex items-center gap-3 text-[var(--color-primary)]">
          <FiMail className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Contact Concierge Messages</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--color-medium-gray)]">
          Review premium contact submissions and keep members updated as you progress conversations.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => {
          const isActive = statusFilter === filter.value
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] text-white shadow'
                  : 'bg-[var(--color-bg-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {sortedMessages.length === 0 && !isLoading && !isFetching && (
        <div className="rounded-3xl border border-[var(--color-light-purple)]/30 bg-white p-10 text-center text-sm text-[var(--color-medium-gray)]">
          No contact messages in this view.
        </div>
      )}

      {(isLoading || isFetching) && (
        <div className="rounded-3xl border border-[var(--color-light-purple)]/30 bg-white p-10 text-center text-sm text-[var(--color-medium-gray)]">
          Loading messages…
        </div>
      )}

      <div className="space-y-4">
        {sortedMessages.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-[var(--color-light-purple)]/30 bg-white/95 p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">{item.name || 'Unnamed'}</h3>
                <p className="mt-1 text-sm text-[var(--color-medium-gray)]">{item.email || '—'}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">
                  {capitalize(item.channel)}
                </p>
              </div>

              <div className="text-right text-xs text-[var(--color-medium-gray)]">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${statusBadgeStyles(
                    item.status
                  )}`}
                >
                  {capitalize(item.status)}
                </span>
                <p className="mt-3">Received: {formatDateTime(item.createdAt)}</p>
                <p>Updated: {formatDateTime(item.updatedAt)}</p>
                {item.resolvedAt && <p>Resolved: {formatDateTime(item.resolvedAt)}</p>}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--color-bg-light)]/70 p-5 text-sm text-[var(--color-dark-gray)]">
              <p className="whitespace-pre-line leading-relaxed">{item.message}</p>
            </div>

            {item.adminNote && (
              <div className="mt-3 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4 text-xs text-[var(--color-primary)]">
                <p className="font-semibold uppercase tracking-[0.25em]">Admin Note</p>
                <p className="mt-2 whitespace-pre-line text-[var(--color-dark-gray)]">{item.adminNote}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
              {item.status !== 'resolved' && (
                <button
                  type="button"
                  onClick={() => updateMutation.mutate({ id: item.id, status: 'resolved' })}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiCheckCircle className="h-4 w-4" /> Mark Resolved
                </button>
              )}

              {item.status === 'new' && (
                <button
                  type="button"
                  onClick={() => updateMutation.mutate({ id: item.id, status: 'in_progress' })}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-warning)] px-4 py-2 text-[var(--color-warning)] transition hover:bg-[var(--color-warning)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiPlay className="h-4 w-4" /> Start Follow-up
                </button>
              )}

              {item.status !== 'new' && (
                <button
                  type="button"
                  onClick={() => updateMutation.mutate({ id: item.id, status: 'new' })}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] px-4 py-2 text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiRefreshCcw className="h-4 w-4" /> Reopen
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
