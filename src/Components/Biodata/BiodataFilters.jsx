import React from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const divisionOptions = ['Dhaka', 'Chattagra', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

export default function BiodataFilters({ filters, onChange, onReset }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleAgeChange = (field, value) => {
    const parsed = Number(value);
    const safeValue = Number.isFinite(parsed) ? parsed : filters[field];
    onChange({ ...filters, [field]: safeValue });
  };

  return (
    <aside className="flex flex-col gap-6 rounded-3xl border border-[var(--color-light-purple)]/40 bg-[var(--color-card-light)]/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">Filter Option</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)] dark:text-white">Generale filter</h2>
        </div>
        <FiFilter className="text-2xl text-[var(--color-primary)]" />
      </div>

      <div className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[var(--color-medium-gray)] uppercase tracking-wider">Biodata Type</legend>
          <div className="flex flex-wrap gap-2">
            {['all', 'male', 'female'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('type', type)}
                className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition ${filters.type === type ? 'border-[var(--color-primary-accent)] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] text-white shadow' : 'border-[var(--color-light-purple)]/50 text-[var(--color-primary)] hover:border-[var(--color-primary-accent)]/70'}`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[var(--color-medium-gray)] uppercase tracking-wider">Age Range</legend>
          <div className="flex items-center gap-3">
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--color-medium-gray)]">
              Min Age
              <input
                type="number"
                min="18"
                max={filters.maxAge}
                value={filters.minAge}
                onChange={(e) => handleAgeChange('minAge', e.target.value)}
                className="rounded-xl border border-[var(--color-light-purple)]/40 bg-white px-3 py-2 text-sm text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60"
              />
            </label>
            <span className="text-[var(--color-medium-gray)]">to</span>
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-[var(--color-medium-gray)]">
              Max Age
              <input
                type="number"
                min={filters.minAge}
                value={filters.maxAge}
                onChange={(e) => handleAgeChange('maxAge', e.target.value)}
                className="rounded-xl border border-[var(--color-light-purple)]/40 bg-white px-3 py-2 text-sm text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[var(--color-medium-gray)] uppercase tracking-wider">Division</legend>
          <select
            value={filters.division}
            onChange={(e) => handleChange('division', e.target.value)}
            className="w-full rounded-xl border border-[var(--color-light-purple)]/40 bg-white px-3 py-2 text-sm text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60"
          >
            <option value="all">Select division</option>
            {divisionOptions.map((division) => (
              <option key={division} value={division}>{division}</option>
            ))}
          </select>
        </fieldset>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)]"
      >
        <FiRefreshCw className="text-base" /> Reset Filters
      </button>
    </aside>
  );
}
