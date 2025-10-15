import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

// Card component for biodata listings with premium look and feel
export default function BiodataCard({ biodata }) {
  const {
    biodataId,
    biodataType,
    profileImage,
    permanentDivision,
    age,
    occupation,
    views = 0,
  } = biodata;

  const typeLabel = biodataType ? biodataType.charAt(0).toUpperCase() + biodataType.slice(1).toLowerCase() : 'Unknown';

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-[var(--color-light-purple)]/40 bg-[var(--color-card-light)]/90 backdrop-blur shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-accent)]">Biodata ID: {biodataId}</span>
            <h3 className="mt-1 text-lg font-semibold text-[var(--color-primary)] dark:text-white">{typeLabel} Biodata</h3>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-light-purple)]/40 text-[var(--color-primary-accent)] transition hover:bg-[var(--color-primary-accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60"
            aria-label="Save biodata to favourites"
          >
            <FiHeart className="text-base" />
          </button>
        </header>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-bg-light)] via-white to-[var(--color-light-pink)]/30">
            {profileImage ? (
              <img src={profileImage} alt={`Profile ${biodataId}`} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--color-primary)]">
                {typeLabel.charAt(0)}
              </span>
            )}
          </div>

        <div className="grid flex-1 grid-cols-2 gap-3 text-sm text-[var(--color-dark-gray)] dark:text-gray-200">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Division</p>
            <p className="font-medium">{permanentDivision || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Age</p>
            <p className="font-medium">{age ?? '—'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Occupation</p>
            <p className="font-medium">{occupation || 'Not provided'}</p>
          </div>
        </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/60 px-5 py-3 text-sm text-[var(--color-medium-gray)] dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center gap-2">
          <FiEye className="text-base" />
          <span>{views} views</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-xs font-medium text-[var(--color-primary)] transition hover:bg-white hover:text-[var(--color-primary)] focus:outline-none"
          >
            <FiShare2 className="text-sm" /> Share
          </button>
          <Link
            to={`/biodatas/${biodataId}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)]"
          >
            View Profile
          </Link>
        </div>
      </footer>
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.45), transparent 60%)' }} />
    </article>
  );
}
