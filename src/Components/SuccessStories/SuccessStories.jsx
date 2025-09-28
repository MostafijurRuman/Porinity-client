import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaHeart, FaStar } from 'react-icons/fa';

/*
  TODO: Replace placeholder successStoriesData with real API data.
  Integration Plan:
    1. Create endpoint GET /success-stories returning array of stories.
    2. Each story shape:
       {
         id: string;
         coupleImageUrl?: string; // optional combined image
         maleImageUrl?: string;
         femaleImageUrl?: string;
         marriageDate: string; // ISO date
         rating: number; // 1-5
         story: string;
         coupleNames?: string; // "Rahim & Ayesha"
       }
    3. Use tanstack/react-query: useQuery(['success-stories'], () => axiosNormal.get('/success-stories').then(r=>r.data))
    4. Replace local placeholder with data from query.
*/

const successStoriesData = [
  {
    id: '1',
    coupleNames: 'Arif & Samia',
    marriageDate: '2024-02-14',
    rating: 5,
    story: 'We matched within a week and families connected seamlessly. The platform made everything transparent and trustworthy.',
    maleImageUrl: 'https://i.pinimg.com/736x/03/20/56/032056dba58401ffa0e927ba33d048ac.jpg',
    femaleImageUrl: 'https://i.pinimg.com/originals/08/f3/72/08f37253a6d72a62db1296212099c5d7.jpg'
  },
  {
    id: '2',
    coupleNames: 'Ruman & Ripa',
    marriageDate: '2024-07-14',
    rating: 4,
    story: 'Alhamdulillah! Found my life partner after months of searching elsewhere. Powerful filters and verified profiles helped a lot.',
    maleImageUrl: 'https://placehold.co/200x240?text=Ruman',
    femaleImageUrl: 'https://placehold.co/200x240?text=Ripa'
  },
  {
    id: '3',
    coupleNames: 'Khalid & Noor',
    marriageDate: '2025-05-01',
    rating: 5,
    story: 'Highly recommended! Secure communication and respectful culture throughout the process. JazakAllah khair.',
    femaleImageUrl: 'https://images.pexels.com/photos/8784913/pexels-photo-8784913.jpeg?_gl=1*16q06hp*_ga*MTIyODUwMjM1OS4xNzU2Mjc3NTIx*_ga_8JE65Q40S6*czE3NTkwNDA0MzIkbzMkZzEkdDE3NTkwNDA0NTAkajQyJGwwJGgw',
    maleImageUrl: 'https://shaadiwish.com/blog/wp-content/uploads/2022/03/pastel-wedding-dress-for-men-6.jpg'
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, duration: 0.5, ease: 'easeOut' }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } }
};

function RatingStars({ value }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={`h-4 w-4 ${i < value ? 'text-[var(--color-warning)]' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-card-light)]/70 dark:bg-gray-800/60 backdrop-blur ring-1 ring-[var(--color-light-purple)]/25 dark:ring-gray-700/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.18)] transition-shadow">
      <div className="relative h-48 w-full flex items-end justify-center gap-2 bg-gradient-to-br from-[var(--color-bg-light)] via-[var(--color-light-purple)]/10 to-[var(--color-light-pink)]/20 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 p-3">
        {/* Images */}
        <div className="flex items-end gap-3">
          <img src={story.maleImageUrl} alt={story.coupleNames + ' male'} className="h-40 w-32 object-cover rounded-xl shadow-md ring-2 ring-white/70 dark:ring-gray-700" />
          <img src={story.femaleImageUrl} alt={story.coupleNames + ' female'} className="h-44 w-32 object-cover rounded-xl shadow-md ring-2 ring-white/70 dark:ring-gray-700 -ml-4 group-hover:-ml-2 transition-all duration-300" />
        </div>
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-accent)] text-white text-xs font-medium px-3 py-1 shadow">
          <FaHeart className="animate-pulse text-[var(--color-light-pink)]" /> <span>Matched</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] dark:text-gray-100 tracking-wide">
            {story.coupleNames}
          </h3>
          <p className="text-sm text-[var(--color-medium-gray)] dark:text-gray-400">Married on {new Date(story.marriageDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </header>
        <p className="text-[var(--color-dark-gray)] dark:text-gray-300 text-sm leading-relaxed line-clamp-5">
          {story.story}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <RatingStars value={story.rating} />
          {/* <button className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors">
            Read More
          </button> */}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_65%)]"></div>
    </motion.article>
  );
}

export default function SuccessStories() {
  return (
    <section className="py-20 md:py-24 relative" id="success-stories">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[var(--color-bg-light)]/80 to-transparent dark:via-gray-800/60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-light-purple)]/40 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-accent)] shadow-sm backdrop-blur">
            <FaHeart className="text-[var(--color-light-pink)]" /> Success Stories
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] bg-clip-text text-transparent">
            Real Journeys to Nikah
          </h2>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-[var(--color-medium-gray)] dark:text-gray-400 leading-relaxed">
            A glimpse of the beautiful beginnings made possible through our platform. Your story could be next—InshaAllah.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
        >
          {successStoriesData.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-20 relative overflow-hidden rounded-3xl border border-[var(--color-light-purple)]/40 dark:border-gray-700 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] p-[1px] shadow-lg"
        >
          <div className="rounded-3xl bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] dark:text-white tracking-tight">
                Your Success Story Deserves to Shine
              </h3>
              <p className="mt-3 text-sm md:text-base text-[var(--color-medium-gray)] dark:text-gray-400 max-w-xl">
                Share how you found your partner and inspire others on their journey. We will soon enable direct submissions, InshaAllah.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)]">
                Submit Your Story
              </button>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-medium-gray)] dark:text-gray-500">Coming Soon</span>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.45),transparent_55%)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
