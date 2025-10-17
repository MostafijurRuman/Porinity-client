import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiBookOpen, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Navigate, useOutletContext } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

export default function AdminSuccessStories() {
  const axiosSecure = useAxiosSecure();
  const [selectedStory, setSelectedStory] = useState(null);
  const { isAdmin } = useOutletContext() || {};

  const {
    data: stories = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'success-stories'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/success-stories');
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(isAdmin),
    staleTime: 60 * 1000,
    onError: (err) => {
      console.error('Failed to load success stories', err);
      toast.error('Failed to load success stories');
    },
  });

  const handleViewStory = (story) => {
    setSelectedStory(story);
  };

  const closeModal = () => setSelectedStory(null);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Success Stories</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Celebrate meaningful matches shared by the community.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30 text-sm">
          <thead className="bg-[var(--color-bg-light)]/70 text-[var(--color-medium-gray)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Male Biodata ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Female Biodata ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Title</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20 text-[var(--color-dark-gray)]">
            {stories.length === 0 && !isLoading && !isFetching && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  No success stories shared yet.
                </td>
              </tr>
            )}

            {stories.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium">{item.maleBiodataId || '—'}</td>
                <td className="px-4 py-3">{item.femaleBiodataId || '—'}</td>
                <td className="px-4 py-3">{item.title || 'Success Story'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleViewStory(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    <FiBookOpen className="h-4 w-4" /> View Story
                  </button>
                </td>
              </tr>
            ))}

            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-[var(--color-medium-gray)]">
                  Loading success stories…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary)]">{selectedStory.title || 'Success Story'}</h3>
                  <p className="mt-1 text-xs text-[var(--color-medium-gray)]">
                    Male Biodata: {selectedStory.maleBiodataId || '—'} • Female Biodata: {selectedStory.femaleBiodataId || '—'}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[var(--color-bg-light)] p-2 text-[var(--color-medium-gray)] hover:text-[var(--color-primary)]"
                  onClick={closeModal}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-dark-gray)]">
                {selectedStory.story || 'No story details provided.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
