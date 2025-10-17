import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiSearch } from 'react-icons/fi';
import BiodataFilters from '../../Components/Biodata/BiodataFilters';
import BiodataCard from '../../Components/Biodata/BiodataCard';
import BiodataGridSkeleton from '../../Components/Biodata/BiodataGridSkeleton';
import axiosNormal from '../../Hooks/axiosNormal';

// Division options reused in both filter and auto-generation
const divisions = ['Dhaka', 'Chattagra', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

// TODO: Replace placeholder generation once the biodata listing API is finalized.
const placeholderBiodata = Array.from({ length: 45 }).map((_, index) => {
  const id = 1600 + index;
  const gender = index % 2 === 0 ? 'Male' : 'Female';
  const division = divisions[index % divisions.length];
  return {
    biodataId: `PRNT-${id}`,
    biodataType: gender,
    permanentDivision: division,
    age: 22 + (index % 10),
    occupation: gender === 'Male' ? 'Engineer' : 'Student',
    profileImage: '',
    views: Math.floor(Math.random() * 120) + 1,
  };
});

const defaultFilters = {
  type: 'all',
  minAge: 18,
  maxAge: 45,
  division: 'all',
  searchId: '',
};

const PAGE_SIZE = 15;

export default function Biodatas() {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['biodataAll', filters, page],
    queryFn: async () => {
      const params = {
        page,
        limit: PAGE_SIZE,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
      };

      if (filters.type && filters.type !== 'all') {
        params.type = filters.type;
      }

      if (filters.division && filters.division !== 'all') {
        params.division = filters.division;
      }

      if (filters.searchId) {
        params.searchId = filters.searchId.trim();
      }

      const res = await axiosNormal.get('/biodata', { params });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const pagination = data?.pagination;
  const serverList = data?.data ?? [];

  const fallbackTotal = placeholderBiodata.length;
  const fallbackTotalPages = Math.max(1, Math.ceil(fallbackTotal / PAGE_SIZE));
  const safeFallbackPage = Math.min(page, fallbackTotalPages);
  const fallbackList = useMemo(() => {
    const start = (safeFallbackPage - 1) * PAGE_SIZE;
    return placeholderBiodata.slice(start, start + PAGE_SIZE);
  }, [safeFallbackPage]);

  const currentPage = isError ? safeFallbackPage : pagination?.page ?? page;
  const totalPages = isError ? fallbackTotalPages : pagination?.totalPages ?? 1;
  const totalCount = isError ? fallbackTotal : pagination?.total ?? 0;
  const limit = isError ? PAGE_SIZE : pagination?.limit ?? PAGE_SIZE;

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const listing = isError ? fallbackList : serverList;
  const showSkeleton = isLoading;
  const isEmpty = !showSkeleton && !isFetching && listing.length === 0 && !isError;

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const showingTo = totalCount === 0 ? 0 : Math.min(showingFrom + listing.length - 1, totalCount);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleFiltersChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  return (
    <main className="relative bg-[var(--color-bg-light)]/60 py-14">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_top,rgba(82,43,121,0.12),transparent_60%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">
        <div className="lg:w-80 xl:w-96">
          {/* <div>Total biodata : {biodata.length}</div> */}
          <BiodataFilters filters={filters} onChange={handleFiltersChange} onReset={handleReset} />
        </div>

        <section className="flex-1">
          <header className="flex flex-col gap-6 rounded-3xl border border-[var(--color-light-purple)]/30 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-primary-accent)]">All Biodatas</p>
                <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold text-[var(--color-primary)] dark:text-white">
                  <FiUsers className="text-[var(--color-primary-accent)]" />
                  All Biodatas
                </h1>
                <p className="mt-2 text-sm text-[var(--color-medium-gray)]">Refine the list using smart filters to find the perfect match effortlessly.</p>
              </div>
              <div className="relative w-full max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-medium-gray)]" />
                <input
                  type="text"
                  placeholder="Search by ID..."
                  value={filters.searchId}
                  onChange={(e) => handleFiltersChange({ ...filters, searchId: e.target.value })}
                  className="w-full rounded-full border border-[var(--color-light-purple)]/40 bg-white px-10 py-2 text-sm text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/50"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-medium-gray)] uppercase tracking-wide">
              <span>
                Showing {totalCount === 0 ? 0 : `${showingFrom}-${showingTo}`} of {totalCount} biodatas
              </span>
              <span>Filters: Type <strong className="text-[var(--color-primary)]">{filters.type}</strong>, Age {filters.minAge}-{filters.maxAge}, Division <strong className="text-[var(--color-primary)]">{filters.division}</strong></span>
            </div>
            {isError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                Unable to load biodatas from server. Using showcase list for now. ({error?.message || 'Network error'})
              </p>
            )}
            {isFetching && !isLoading && (
              <p className="text-xs text-[var(--color-medium-gray)]">Updating list…</p>
            )}
          </header>

          <div className="mt-6 space-y-8">
            {isLoading ? (
              <BiodataGridSkeleton count={6} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {isEmpty ? (
                  <p className="col-span-full text-center text-sm font-medium text-[var(--color-medium-gray)]">
                    No biodata matches the selected filters yet. Try adjusting the criteria.
                  </p>
                ) : (
                  listing.map((item) => (
                    <BiodataCard key={item.biodataId} biodata={item} />
                  ))
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrev || isFetching}
                  className="rounded-full border border-[var(--color-light-purple)]/40 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-[var(--color-dark-gray)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext || isFetching}
                  className="rounded-full border border-[var(--color-light-purple)]/40 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            )}

            <div className="rounded-3xl border border-[var(--color-light-purple)]/30 bg-white/70 p-6 text-center text-sm text-[var(--color-medium-gray)] shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <p>
                Need more tailored recommendations? Connect with our concierge team for curated biodata suggestions aligned with your family preferences.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
