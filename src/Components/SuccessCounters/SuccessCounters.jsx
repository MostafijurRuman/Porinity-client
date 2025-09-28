import { useEffect, useRef, useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import CountUp from 'react-countup';
import { FaUserFriends, FaFemale, FaMale } from 'react-icons/fa';
import { GiDiamondRing } from 'react-icons/gi';
import { useQuery } from '@tanstack/react-query';
import axiosNormal from '../../Hooks/axiosNormal';

/* SuccessCounters (clean implementation)
   Fetches /biodata and derives total, male, female counts.
   Marriages count uses a placeholder until its API exists.
*/

const MARRIAGES_PLACEHOLDER = 7; // TODO: replace with real API value

export default function SuccessCounters() {
  const { data: biodata = [], isLoading, isError, error } = useQuery({
    queryKey: ['biodataAllForStats'],
    queryFn: async () => {
      const res = await axiosNormal.get('/biodata');
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 60_000,
  });

  const stats = useMemo(() => {
    let male = 0, female = 0;
    for (const b of biodata) {
      const t = (b?.biodataType || '').toLowerCase();
      if (t === 'male') male++;
      else if (t === 'female') female++;
    }
    return { total: biodata.length, male, female };
  }, [biodata]);

  return (
    <section className="relative w-full py-16 lg:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-50/60 to-white dark:via-fuchsia-900/10 dark:to-gray-900 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">Growing With Your Trust</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">Real progress from real people. These numbers will update as the community expands.</p>
        </header>

        {isError && (
          <div className="text-center text-sm text-red-600 dark:text-red-400 mb-8">Unable to load stats {error?.message && <span>({error.message})</span>}</div>
        )}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CounterCard label="Total Biodata" icon={FaUserFriends} value={stats.total} accent="from-fuchsia-500 to-pink-500" delay={0} loading={isLoading} />
          <CounterCard label="Girls Biodata" icon={FaFemale} value={stats.female} accent="from-pink-500 to-rose-500" delay={0.08} loading={isLoading} />
          <CounterCard label="Boys Biodata" icon={FaMale} value={stats.male} accent="from-indigo-500 to-fuchsia-500" delay={0.16} loading={isLoading} />
          <CounterCard label="Marriages Completed" icon={GiDiamondRing} value={MARRIAGES_PLACEHOLDER} accent="from-green-500 to-emerald-500" delay={0.24} loading={false} />
        </ul>
      </div>
    </section>
  );
}

// eslint-disable-next-line no-unused-vars
function CounterCard({ label, icon: Icon, value, accent, delay = 0, loading = false }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setStart(true); observer.disconnect(); }
      });
    }, { threshold: 0.45 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.55, delay } });
  }, [controls, delay]);

  return (
    <motion.li ref={ref} initial={{ opacity: 0, y: 24 }} animate={controls} className="relative group h-full">
      <div className="h-full flex flex-col rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition overflow-hidden">
        <div className="flex items-center gap-4 p-6 pb-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white text-xl shadow-inner`}>
            <Icon />
          </span>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-tight">{label}</h3>
        </div>
        <div className="px-6 pb-6 pt-1 flex-1 flex flex-col">
          <div className="text-4xl font-extrabold font-heading bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm min-h-[2.75rem] flex items-end">
            {loading ? <span className="animate-pulse opacity-30">0</span> : start ? <CountUp end={value} duration={1.6} separator="," /> : <span className="opacity-30">0</span>}
          </div>
          <span className="mt-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Updated live</span>
          <div className="mt-auto pt-4 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60">
            <span>Growing daily</span>
            <span className="font-medium text-fuchsia-600 dark:text-fuchsia-400">#{label.split(' ')[0]}</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-fuchsia-400/0 group-hover:ring-2 group-hover:ring-fuchsia-300/60 dark:group-hover:ring-fuchsia-500/50 transition" />
      </div>
    </motion.li>
  );
}
