import React, { useCallback, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaPaperPlane } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosNormal from '../../Hooks/axiosNormal';

const FALLBACK_MALE = 'https://i.postimg.cc/8C0t3P0f/porinity-groom-fallback.jpg';
const FALLBACK_FEMALE = 'https://i.postimg.cc/SxJNB2nF/porinity-bride-fallback.jpg';
const AUTO_SLIDE_INTERVAL = 8000;
const MIN_STORY_LENGTH = 50;
const MIN_STORIES_PER_VIEW = 3;

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const RatingStars = ({ value }) => (
  <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} className={`h-4 w-4 ${index < value ? 'text-[var(--color-warning)]' : 'text-gray-300 dark:text-gray-600'}`} />
    ))}
  </div>
);

const StoryCard = ({ story, onShareRequested }) => {
  const isPlaceholder = Boolean(story.__placeholder);
  const groomImage = isPlaceholder ? FALLBACK_MALE : (story.maleImageUrl || story.heroImageUrl || FALLBACK_MALE);
  const brideImage = isPlaceholder ? FALLBACK_FEMALE : (story.femaleImageUrl || story.heroImageUrl || FALLBACK_FEMALE);
  const formattedDate = !isPlaceholder && story.marriageDate
    ? new Date(story.marriageDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Awaiting your celebration';
  const storyBody = isPlaceholder
    ? 'Let other Porinity families learn from your journey. Share the steps that led to your Nikah and we will feature it here after review.'
    : story.story;
  const submitterLabel = isPlaceholder
    ? 'This space is reserved for your story'
    : story.submittedBy?.name
      ? `Shared by ${story.submittedBy.name}`
      : null;

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--color-card-light)]/70 dark:bg-gray-800/60 backdrop-blur ring-1 ring-[var(--color-light-purple)]/25 dark:ring-gray-700/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.18)] transition-shadow"
    >
      <div className="relative flex h-52 w-full items-end justify-center gap-4 bg-gradient-to-br from-[var(--color-bg-light)] via-[var(--color-light-purple)]/10 to-[var(--color-light-pink)]/20 p-4 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
        <div className="flex items-end gap-4">
          <img src={groomImage} alt={`${story.coupleNames} groom`} className="h-40 w-32 rounded-xl object-cover shadow-md ring-2 ring-white/70 dark:ring-gray-700" />
          <img src={brideImage} alt={`${story.coupleNames} bride`} className="-ml-4 h-44 w-32 rounded-xl object-cover shadow-md ring-2 ring-white/70 transition-all duration-300 group-hover:-ml-1 dark:ring-gray-700" />
        </div>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-accent)] px-3 py-1 text-xs font-medium text-white shadow">
          <FaHeart className="animate-pulse text-[var(--color-light-pink)]" />
          <span>Porinity Match</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-wide text-[var(--color-primary)] dark:text-gray-100">{story.coupleNames || (isPlaceholder ? 'Your Journey Awaits' : 'Porinity Couple')}</h3>
          <p className="text-sm text-[var(--color-medium-gray)] dark:text-gray-400">{isPlaceholder ? 'Tell us when and where the big day happened' : `Married on ${formattedDate}${story.weddingCity ? ` • ${story.weddingCity}` : ''}`}</p>
        </header>
        <p className="line-clamp-5 text-sm leading-relaxed text-[var(--color-dark-gray)] dark:text-gray-300">{storyBody}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <RatingStars value={story.rating || 5} />
          {submitterLabel && (
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)] dark:text-gray-500">{submitterLabel}</span>
          )}
        </div>
        {isPlaceholder && (
          <button
            type="button"
            onClick={onShareRequested}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-[var(--color-light-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2"
          >
            <FaPaperPlane className="text-sm" /> Share Your Story
          </button>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_65%)]" />
    </motion.article>
  );
};

const chunkStories = (stories, size) => {
  if (!Array.isArray(stories) || size <= 0) return [];
  const chunks = [];
  for (let index = 0; index < stories.length; index += size) {
    chunks.push(stories.slice(index, index + size));
  }
  return chunks;
};

const getSlideColumnsClass = (count) => {
  if (count >= 3) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1';
};

export default function SuccessStories() {
  const queryClient = useQueryClient();
  const itemsPerSlide = MIN_STORIES_PER_VIEW;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: stories = [], isLoading, isError, error } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data } = await axiosNormal.get('/success-stories');
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60_000,
  });

  const enrichedStories = useMemo(() => {
    if (isLoading) return stories;
    const baseStories = stories.filter(Boolean);
    if (baseStories.length >= MIN_STORIES_PER_VIEW) return baseStories;

    const placeholders = Array.from({ length: MIN_STORIES_PER_VIEW - baseStories.length }, (_, index) => ({
      id: `placeholder-${index}`,
      __placeholder: true,
      coupleNames: null,
      story: null,
      rating: 5,
      marriageDate: null,
      submittedBy: null,
      weddingCity: null,
    }));

    return [...baseStories, ...placeholders];
  }, [stories, isLoading]);

  const slides = useMemo(() => chunkStories(enrichedStories, itemsPerSlide), [enrichedStories, itemsPerSlide]);
  const columnsClass = useMemo(() => getSlideColumnsClass(itemsPerSlide), [itemsPerSlide]);
  const fallbackGroups = useMemo(() => {
    const count = Math.max(itemsPerSlide, MIN_STORIES_PER_VIEW);
    return [Array.from({ length: count }, (_, index) => ({ id: `skeleton-${index}`, __skeleton: true }))];
  }, [itemsPerSlide]);
  const slideGroups = slides.length ? slides : (isLoading ? fallbackGroups : []);

  useEffect(() => {
    setActiveIndex(0);
  }, [stories.length]);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length && slides.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % Math.max(slides.length, 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const submitStory = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosNormal.post('/success-stories', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Your story is awaiting approval. JazakAllah khair!');
      queryClient.invalidateQueries(['success-stories']);
      setIsFormOpen(false);
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'We could not submit your story. Please try again shortly.';
      toast.error(message);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      coupleNames: formData.get('coupleNames')?.toString().trim() || '',
      groomName: formData.get('groomName')?.toString().trim() || '',
      brideName: formData.get('brideName')?.toString().trim() || '',
      marriageDate: formData.get('marriageDate')?.toString().trim() || '',
      weddingCity: formData.get('weddingCity')?.toString().trim() || '',
      story: formData.get('story')?.toString().trim() || '',
      rating: formData.get('rating')?.toString().trim() || '5',
      heroImageUrl: formData.get('heroImageUrl')?.toString().trim() || '',
      maleImageUrl: formData.get('maleImageUrl')?.toString().trim() || '',
      femaleImageUrl: formData.get('femaleImageUrl')?.toString().trim() || '',
      submitterName: formData.get('submitterName')?.toString().trim() || '',
      submitterEmail: formData.get('submitterEmail')?.toString().trim() || '',
      submitterPhone: formData.get('submitterPhone')?.toString().trim() || '',
    };

    if (payload.story.length < MIN_STORY_LENGTH) {
      toast.error('Please share at least a short paragraph so others can be inspired.');
      return;
    }

    try {
      await submitStory.mutateAsync(payload);
      form.reset();
    } catch (err) {
      console.error('Story submission failed', err);
    }
  };

  return (
    <section className="relative py-20 md:py-24" id="success-stories">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[var(--color-bg-light)]/80 to-transparent dark:via-gray-800/60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-light-purple)]/40 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-accent)] shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/70">
            <FaHeart className="text-[var(--color-light-pink)]" /> Success Stories
          </span>
          <h2 className="mt-5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Real Journeys to Nikah
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-medium-gray)] dark:text-gray-400 md:text-base">
            Witness how Porinity families met, aligned values, and celebrated a blessed union.
          </p>
        </div>

        {isError && (
          <p className="mb-8 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-300">
            Unable to load stories {error?.message && <span>({error.message})</span>}
          </p>
        )}

        <div className="relative" aria-busy={isLoading}>
          <div className="overflow-hidden rounded-3xl border border-[var(--color-light-purple)]/30 bg-white/60 p-2 shadow-lg backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ width: `${Math.max(slideGroups.length, 1) * 100}%` }}
            >
              {slideGroups.map((group, slideIdx) => (
                <div key={`slide-${slideIdx}`} className="flex w-full flex-shrink-0 flex-col px-1">
                  <div className={`grid gap-6 ${columnsClass}`}>
                    {group.map((story, index) => {
                      if (story.__skeleton) {
                        return (
                          <div
                            key={`skeleton-${slideIdx}-${index}`}
                            className="h-80 rounded-2xl border border-dashed border-[var(--color-primary)]/20 bg-white/40 dark:border-gray-700/50 dark:bg-gray-800/40"
                          >
                            <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-[var(--color-light-purple)]/10 via-white/40 to-transparent" />
                          </div>
                        );
                      }
                      return (
                        <StoryCard
                          key={story.id || `story-${slideIdx}-${index}`}
                          story={story}
                          onShareRequested={() => setIsFormOpen(true)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-primary)]/20 transition hover:-translate-x-1 hover:bg-white dark:bg-gray-900/90 dark:text-white"
                aria-label="Previous stories"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-primary)]/20 transition hover:translate-x-1 hover:bg-white dark:bg-gray-900/90 dark:text-white"
                aria-label="Next stories"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {slides.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {slides.map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={`h-2 w-8 rounded-full transition ${index === activeIndex ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/20'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && !stories.length && (
          <p className="mt-6 text-center text-sm font-medium text-[var(--color-medium-gray)] dark:text-gray-500">
            No journeys published yet. Share yours to inspire other Porinity families.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-20 relative overflow-hidden rounded-3xl border border-[var(--color-light-purple)]/40 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] p-[1px] shadow-lg dark:border-gray-700"
        >
          <div className="relative rounded-3xl bg-white p-8 md:p-12 dark:bg-gray-900">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--color-primary)] dark:text-white md:text-3xl">
                  Your Success Story Deserves to Shine
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-medium-gray)] dark:text-gray-400 md:text-base">
                  Tell us how Porinity brought your families together. After a short admin review, approved stories appear in this carousel.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen((prev) => !prev)}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-6 py-3 text-sm font-semibold text-white shadow hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)]"
                >
                  <FaPaperPlane /> Share Your Story
                </button>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-medium-gray)] dark:text-gray-500">
                  Reviewed within 48 hours
                </span>
              </div>
            </div>

            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-10 grid gap-4 rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/60 p-6 shadow-inner dark:border-gray-700/60 dark:bg-gray-800/50">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Couple Names
                    <input name="coupleNames" type="text" placeholder="e.g. Rahim & Ayesha" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Wedding City
                    <input name="weddingCity" type="text" placeholder="City / Country" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Groom Name
                    <input name="groomName" type="text" placeholder="Groom" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Bride Name
                    <input name="brideName" type="text" placeholder="Bride" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Wedding Date
                    <input name="marriageDate" type="date" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Rating (1-5)
                    <input name="rating" type="number" min="1" max="5" defaultValue="5" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                </div>

                <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                  Your Story
                  <textarea
                    name="story"
                    required
                    rows="4"
                    placeholder="Share the journey, how families connected, and what made Porinity special."
                    className="mt-2 resize-none rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Couple Photo URL
                    <input name="heroImageUrl" type="url" placeholder="https://" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Groom Photo URL
                    <input name="maleImageUrl" type="url" placeholder="https://" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Bride Photo URL
                    <input name="femaleImageUrl" type="url" placeholder="https://" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Submitter Name
                    <input name="submitterName" type="text" placeholder="Your name" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Submitter Email*
                    <input name="submitterEmail" type="email" required placeholder="you@example.com" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                  <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                    Contact Phone
                    <input name="submitterPhone" type="tel" placeholder="Optional" className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40" />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitStory.isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--color-light-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitStory.isLoading ? 'Submitting…' : 'Submit For Review'}
                  </button>
                  <span className="text-xs text-[var(--color-medium-gray)] dark:text-gray-500">
                    We only publish after admin approval to preserve privacy and authenticity.
                  </span>
                </div>
              </form>
            )}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.45),transparent_55%)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
