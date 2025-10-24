import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';
import { TfiCrown } from 'react-icons/tfi';
import { toast } from 'react-toastify';
import useFavorites from '../../Hooks/useFavorites';
import useAuth from '../../Hooks/UseAuth';

// Card component for biodata listings with premium look and feel
export default function BiodataCard({ biodata }) {
  const {
    biodataId,
    biodataType,
    profileImage,
    permanentDivision,
    age,
    occupation,
    views,
  } = biodata;

  const isPremium = biodata?.premiumStatus === 'approved';

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};
  const {
    favouritesIds,
    addFavorite,
    isAddingFavorite,
    removeFavorite,
    isRemovingFavorite,
  } = useFavorites();

  const viewCount = Number.isFinite(Number(views)) ? Number(views) : 0;
  const showViews = viewCount > 0;

  const typeLabel = biodataType ? biodataType.charAt(0).toUpperCase() + biodataType.slice(1).toLowerCase() : 'Unknown';
  const isFavourite = useMemo(
    () => Array.isArray(favouritesIds) && favouritesIds.includes(biodataId),
    [favouritesIds, biodataId],
  );
  const isMutatingFavourite = isAddingFavorite || isRemovingFavorite;

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/biodatas/${biodataId}`;
  }, [biodataId]);

  const handleShare = useCallback(async () => {
    if (!shareUrl) {
      toast.error('Share link is unavailable right now.');
      return;
    }

    try {
      const shareData = {
        title: `Biodata ${biodataId}`,
        text: 'Check out this biodata profile on Porinity.',
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Profile shared successfully');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.info('Link copied to clipboard');
        return;
      }

      throw new Error('Share API not supported');
    } catch (err) {
      console.error('Share failed', err);
      toast.error('Unable to share this biodata right now.');
    }
  }, [biodataId, shareUrl]);

  const handleToggleFavourite = useCallback(async () => {
    if (!user?.uid) {
      toast.info('Please log in to manage favourites.');
      navigate('/login', { state: location?.pathname || '/biodatas' });
      return;
    }

    if (isMutatingFavourite) return;

    try {
      if (isFavourite) {
        const response = await removeFavorite(biodataId);
        const message = response?.message || 'Biodata removed from favourites';
        toast.success(message);
      } else {
        const response = await addFavorite(biodataId);
        const message = response?.message || 'Biodata added to favourites';
        toast.success(message);
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to update favourites right now.';
      toast.error(message);
    }
  }, [
    addFavorite,
    biodataId,
    isFavourite,
    isMutatingFavourite,
    navigate,
    removeFavorite,
    user?.uid,
    location?.pathname,
  ]);

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-[var(--color-light-purple)]/40 bg-[var(--color-card-light)]/90 backdrop-blur shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-accent)]">Biodata ID: {biodataId}</span>
            <div className="mt-1 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--color-primary)] dark:text-white">{typeLabel} Biodata</h3>
              {isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
                  <TfiCrown className="text-[10px]" /> Premium
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleFavourite}
            disabled={isMutatingFavourite}
            aria-pressed={isFavourite}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60 disabled:cursor-not-allowed disabled:opacity-70 ${
              isFavourite
                ? 'border-[var(--color-primary-accent)] bg-[var(--color-primary-accent)] text-white shadow'
                : 'border-[var(--color-light-purple)]/40 text-[var(--color-primary-accent)] hover:bg-[var(--color-primary-accent)] hover:text-white'
            }`}
            aria-label={isFavourite ? 'Remove biodata from favourites' : 'Save biodata to favourites'}
          >
            <FiHeart className="text-base" style={{ fill: isFavourite ? 'currentColor' : 'none' }} />
          </button>
        </header>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-bg-light)] via-white to-[var(--color-light-pink)]/30">
            {isPremium && (
              <span className="absolute -top-2 -right-2 inline-flex h-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-2 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                <TfiCrown className="text-xs" />
              </span>
            )}
            {profileImage ? (
              <img src={profileImage} alt={`Profile ${biodataId}`} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[var(--color-primary)]">
                {typeLabel.charAt(0)}
              </span>
            )}
          </div>

          {/* Info grid: prevent overlap by using min-w-0 and text-ellipsis */}
          <div className="grid flex-1 grid-cols-2 gap-3 text-sm text-[var(--color-dark-gray)] dark:text-gray-200 min-w-0">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Division</p>
              <p className="font-medium truncate" title={permanentDivision || 'Not set'}>{permanentDivision || 'Not set'}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Age</p>
              <p className="font-medium truncate" title={age ?? '—'}>{age ?? '—'}</p>
            </div>
            <div className="col-span-2 min-w-0">
              <p className="text-xs uppercase tracking-wide text-[var(--color-medium-gray)]">Occupation</p>
              <p className="font-medium truncate" title={occupation || 'Not provided'}>{occupation || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/60 px-5 py-3 text-sm text-[var(--color-medium-gray)] dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex min-h-[1.5rem] items-center gap-2">
          {showViews && (
            <>
              <FiEye className="text-base" />
              <span>{viewCount} views</span>
            </>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleShare}
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
