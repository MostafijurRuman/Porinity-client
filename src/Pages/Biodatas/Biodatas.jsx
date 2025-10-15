import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiSearch } from 'react-icons/fi';
import BiodataFilters from '../../Components/Biodata/BiodataFilters';
import BiodataCard from '../../Components/Biodata/BiodataCard';
import BiodataGridSkeleton from '../../Components/Biodata/BiodataGridSkeleton';
import axiosNormal from '../../Hooks/axiosNormal';

// Division options reused in both filter and auto-generation
const divisions = ['Dhaka', 'Chattagra', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

// TODO: Replace placeholder generation once the biodata listing API is finalized.
const placeholderBiodata = Array.from({ length: 20 }).map((_, index) => {
  const id = 1600 + index;
  const gender = index % 2 === 0 ? 'Male' : 'Female';
  const division = divisions[index % divisions.length];
  return {
    biodataId: id,
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

export default function Biodatas() {
  const [filters, setFilters] = useState(defaultFilters);

  const { data: biodata = [], isLoading, isError, error } = useQuery({
    queryKey: ['biodataAll'],
    queryFn: async () => {
      const res = await axiosNormal.get('/biodata');
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const sourceList = useMemo(() => {
    const list = Array.isArray(biodata) && biodata.length ? biodata : placeholderBiodata;
    return list.slice(0, 20);
  }, [biodata]);

  const filtered = useMemo(() => {
    return sourceList.filter((item) => {
      const ageValue = parseInt(item?.age, 10);
      const matchesAge = Number.isNaN(ageValue)
        ? true
        : ageValue >= filters.minAge && ageValue <= filters.maxAge;

      const typeValue = (item?.biodataType || '').toLowerCase();
      const matchesType =
        filters.type === 'all' || typeValue === filters.type.toLowerCase();

      const divisionValue = item?.permanentDivision || '';
      const matchesDivision =
        filters.division === 'all' || divisionValue === filters.division;

      const idString = String(item?.biodataId || '').toLowerCase();
      const matchesSearch = filters.searchId
        ? idString.includes(filters.searchId.toLowerCase())
        : true;

      return matchesAge && matchesType && matchesDivision && matchesSearch;
    });
  }, [sourceList, filters]);

  const handleFiltersChange = (next) => {
    setFilters(next);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <main className="relative bg-[var(--color-bg-light)]/60 py-14">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_top,rgba(82,43,121,0.12),transparent_60%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">
        <div className="lg:w-80 xl:w-96">
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
              <span>Showing {filtered.length} of {sourceList.length} biodatas</span>
              <span>Filters: Type <strong className="text-[var(--color-primary)]">{filters.type}</strong>, Age {filters.minAge}-{filters.maxAge}, Division <strong className="text-[var(--color-primary)]">{filters.division}</strong></span>
            </div>
            {isError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                Unable to load biodatas from server. Using showcase list for now. ({error?.message || 'Network error'})
              </p>
            )}
          </header>

          <div className="mt-6 space-y-8">
            {isLoading ? (
              <BiodataGridSkeleton count={6} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.length === 0 ? (
                  <p className="col-span-full text-center text-sm font-medium text-[var(--color-medium-gray)]">
                    No biodata matches the selected filters yet. Try adjusting the criteria.
                  </p>
                ) : (
                  filtered.map((item) => (
                    <BiodataCard key={item.biodataId} biodata={item} />
                  ))
                )}
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
