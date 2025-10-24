import React from 'react';
import { FaUserEdit, FaSearch, FaPhoneAlt, FaHeart } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

/*
  HowItWorks Section
  Positioned below premium membership area on Home page.
  Design language: Tailwind utility classes matching existing gradient + fuchsia / indigo accent usage.
*/

const steps = [
  {
    id: 1,
    title: 'Create Biodata',
    icon: FaUserEdit,
    blurb: 'You can easily create a biodata on Porinity completely free of cost within some guided steps.',
    accent: 'from-indigo-50 to-fuchsia-50 dark:from-indigo-900/30 dark:to-fuchsia-900/30'
  },
  {
    id: 2,
    title: 'Search Biodata',
    icon: FaSearch,
    blurb: 'Search biodata using many smart filters including age, upazila, profession, and education.',
    accent: 'from-pink-50 to-fuchsia-50 dark:from-pink-900/30 dark:to-fuchsia-900/30'
  },
  {
    id: 3,
    title: 'Contact Guardians',
    icon: FaPhoneAlt,
    blurb: "If someone likes your biodata or you like theirs you can directly contact their parent/guardian.",
    accent: 'from-rose-50 to-fuchsia-50 dark:from-rose-900/30 dark:to-fuchsia-900/30'
  },
  {
    id: 4,
    title: 'Get Married',
    icon: FaHeart,
    blurb: 'If compatibility feels right, proceed with proper inquiry & get married according to Sunnah.',
    accent: 'from-fuchsia-50 to-indigo-50 dark:from-fuchsia-900/30 dark:to-indigo-900/30'
  }
];

export default function HowItWorks() {
  return (
    <section className="relative w-full py-14 lg:py-20 overflow-hidden">
      {/* subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20 [mask-image:radial-gradient(circle_at_center,white,transparent)]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
        <div className="absolute inset-0 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 20% 30%,rgba(244,114,182,0.15),transparent 60%), radial-gradient(circle at 80% 70%,rgba(129,140,248,0.15),transparent 55%)'}} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
            How <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Porinity</span> Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            A simple, transparent process designed to help you connect with the right family swiftly & respectfully.
          </p>
        </header>

        <ol className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative group"
              >
                <div className="h-full flex flex-col rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition overflow-hidden">
                  {/* top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500" />

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-xl border border-fuchsia-200/60 dark:border-fuchsia-700/40 bg-gradient-to-br ${step.accent} text-fuchsia-700 dark:text-fuchsia-300 text-xl shadow-inner`}> 
                        <Icon />
                      </span>
                      <span className="text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/30 px-2 py-1 rounded-full tracking-wide">
                        Step {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 flex-1">
                      {step.blurb}
                    </p>

                    {/* subtle bottom link placeholder future expansion */}
                    <div className="mt-5 pt-3 border-t border-gray-100/70 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {idx < steps.length - 1 ? 'Next →' : 'Begin today'}
                      </span>
                      <span className="font-medium text-fuchsia-600 dark:text-fuchsia-400">{idx + 1} / {steps.length}</span>
                    </div>
                  </div>

                  {/* glow on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-fuchsia-400/0 group-hover:ring-2 group-hover:ring-fuchsia-300/60 dark:group-hover:ring-fuchsia-500/50 transition" />
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
          <a href="/dashboard/edit-biodata" className="relative inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 shadow hover:shadow-md transition">
            Get Started Free
          </a>
          <a href="/biodatas" className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300 hover:underline">
            Browse Biodata →
          </a>
        </div>
      </div>
    </section>
  );
}
