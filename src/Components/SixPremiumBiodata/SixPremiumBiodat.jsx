import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import axiosNormal from '../../Hooks/axiosNormal';

export default function SixPremiumBiodat() {
  const { data: biodata = [], isLoading, isError, error } = useQuery({
    queryKey: ['biodataTopSix'],
    queryFn: async () => {
      const res = await axiosNormal.get('/biodata'); //Todo: Update api link form premium biodta api
      return res.data;
    }
  });
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const premiumBiodata = useMemo(() => {
    const list = Array.isArray(biodata) ? [...biodata] : [];
    list.sort((a, b) => {
      const ageA = parseInt(a?.age, 10);
      const ageB = parseInt(b?.age, 10);
      const validA = Number.isFinite(ageA) ? ageA : (sortOrder === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
      const validB = Number.isFinite(ageB) ? ageB : (sortOrder === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
      return sortOrder === 'asc' ? validA - validB : validB - validA;
    });
    return list.slice(0, 6);
  }, [biodata, sortOrder]);

return (
    <section className="w-full py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
                        ✨ Featured Premium Profiles
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                        A quick look at hand‑selected premium members. Explore, compare, and find a compatible match.
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2 md:w-60">
                    <label
                        htmlFor="ageSort"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
                    >
                        Age order:
                    </label>
                    <select
                        id="ageSort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full  rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                    >
                        <option value="asc">Youngest first</option>
                        <option value="desc">Oldest first</option>
                    </select>
                </div>
            </header>

            {isLoading && (
                    <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse h-40 rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-800/60"
                            >
                                <div className="h-full w-full flex p-4 gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                                        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                    <div className="h-9 w-28 self-start rounded-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                            </div>
                        ))}
                    </div>
            )}

            {isError && (
                <div className="text-center text-red-600 font-medium">
                    Unable to load premium profiles. {error?.message ? `(${error.message})` : 'Please try again shortly.'}
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {premiumBiodata.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No premium profiles are available right now. Check back soon.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {premiumBiodata.map((profile) => (
                                <BiodataCard key={profile.biodataId} profile={profile} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    </section>
);
}

function BiodataCard({ profile }) {
  const {
    biodataId,
    biodataType,
    profileImage,
    permanentDivision,
    age,
    occupation
  } = profile;

  const shortType = biodataType ? biodataType.toUpperCase().slice(0, 3) : 'ID';

  return (
    <div
      className="
        group relative flex h-full flex-col rounded-xl border
        border-gray-200 bg-white shadow-sm transition
        hover:shadow-lg dark:border-gray-700/70 dark:bg-gray-800
        sm:h-40
      "
    >
      <div className="flex flex-1 items-center gap-4 p-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="
              relative h-16 w-16 rounded-full border border-fuchsia-100
              bg-gradient-to-br from-indigo-50 to-fuchsia-50
              dark:from-indigo-900/30 dark:to-fuchsia-900/30 overflow-hidden
              flex items-center justify-center
            "
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={`Profile ${biodataId}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-indigo-700 dark:text-indigo-300 text-sm font-semibold">{shortType}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center min-w-0">
          <h3 className="text-sm sm:text-base font-bold tracking-wide text-gray-900 dark:text-white">
            ID-{biodataId}
          </h3>

          {/* Info lines */}
          <ul className="mt-1 space-y-0.5 text-[13px] leading-snug text-gray-700 dark:text-gray-300">
            <li>Biodata Type: {biodataType || '—'}</li>
            <li>Age: {age ?? '—'}</li>
            <li>Occupation: {occupation || 'Not specified'}</li>
            <li>Division: {permanentDivision || 'Unknown'}</li>
          </ul>
        </div>

        {/* Action button */}
        <div className="self-start">
          <Link
            to={`/biodatas/${biodataId}`}
            className="
              relative inline-flex items-center gap-1 rounded-full
              border border-fuchsia-600/70 px-4 py-1.5 text-[12px] font-medium
              text-fuchsia-700 hover:text-white
              transition bg-white hover:bg-gradient-to-r
              from-fuchsia-600 to-pink-600 dark:bg-gray-900
              dark:text-fuchsia-300 dark:border-fuchsia-400/60
              dark:hover:text-white
            "
          >
            View <FiArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Focus / hover outline accent */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-fuchsia-400/0 group-hover:ring-1 group-hover:ring-fuchsia-300/60 dark:group-hover:ring-fuchsia-500/50 transition" />
    </div>
  );
}