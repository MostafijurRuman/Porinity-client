import React, { useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiUser,
  FiHeart,
  FiMail,
  FiPhone,
  FiShield,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosNormal from '../../Hooks/axiosNormal';
import useAuth from '../../Hooks/UseAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useUserAccount from '../../Hooks/useUserAccount';
import BiodataCard from '../../Components/Biodata/BiodataCard';
import useFavorites from '../../Hooks/useFavorites';

// TODO: Replace placeholder fallback with API response once detail endpoint stabilizes
const placeholderDetails = (id) => ({
  biodataId: id,
  biodataType: 'Male',
  permanentDivision: 'Dhaka',
  age: 28,
  occupation: 'Software Engineer',
  dateOfBirth: '1997-06-01',
  about: 'This is a showcase profile used while the detailed API is being wired. Replace with live data soon.',
  height: "5'8\"",
  weight: '68kg',
  race: 'Wheatish',
  fatherName: 'Placeholder Father',
  motherName: 'Placeholder Mother',
  presentDivision: 'Dhaka',
  expectedPartnerAge: '25-30',
  expectedPartnerHeight: "5'4\"-5'8\"",
  expectedPartnerWeight: '55-65kg',
  contactEmail: 'premium-only@example.com',
  mobileNumber: '017XXXXXXXX',
});

const placeholderCollection = Array.from({ length: 6 }).map((_, idx) => ({
  biodataId: `PRNT-${idx + 100}`,
  biodataType: idx % 2 === 0 ? 'Male' : 'Female',
  permanentDivision: ['Dhaka', 'Chattagra', 'Rangpur'][idx % 3],
  age: 24 + idx,
  occupation: idx % 2 === 0 ? 'Engineer' : 'Doctor',
  profileImage: '',
  views: 12 + idx,
}));

export default function BiodataDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { account } = useUserAccount();

  const isPremiumMember = useMemo(() => {
    const accountType = account?.userType ? String(account.userType).toLowerCase() : '';
    if (accountType === 'premium') return true;

    const heuristics = [
      user?.premiumMember,
      user?.isPremium,
      (user?.role && String(user.role).toLowerCase() === 'premium'),
      user?.subscription === 'premium',
    ];
    return heuristics.some(Boolean);
  }, [account?.userType, user?.isPremium, user?.premiumMember, user?.role, user?.subscription]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['biodata', id],
    queryFn: async () => {
      const res = await axiosNormal.get(`/biodata/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  const biodata = data && Object.keys(data).length ? data : placeholderDetails(id);

  const contactRequestsQuery = useQuery({
    queryKey: ['contact-requests', user?.uid],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      const { data: requests } = await axiosSecure.get('/contact-requests', {
        params: { requesterUid: user?.uid },
      });
      return Array.isArray(requests) ? requests : [];
    },
    staleTime: 60 * 1000,
  });

  const { data: similarListRaw = {} } = useQuery({
    queryKey: ['biodataAllForSimilar'],
    queryFn: async () => {
      const res = await axiosNormal.get('/biodata');
      // Expecting { data: [...], pagination: {...} }
      return res.data || {};
    },
    staleTime: 60 * 1000,
    enabled: Boolean(biodata?.biodataType),
  });

  // Use real biodata from API response
  const similarBiodata = useMemo(() => {
    const realList = Array.isArray(similarListRaw.data) ? similarListRaw.data : [];
    return realList
      .filter(
        (item) =>
          item?.biodataId !== biodata?.biodataId &&
          (item?.biodataType || '').toLowerCase() === (biodata?.biodataType || '').toLowerCase()
      )
      .slice(0, 3);
  }, [similarListRaw, biodata]);

  const {
    favourites,
    addFavorite,
    isAddingFavorite,
    removeFavorite,
    isRemovingFavorite,
  } = useFavorites();

  const isAlreadyFavourite = useMemo(() => {
    if (!biodata?.biodataId) return false;
    return favourites.some((fav) => fav?.biodataId === biodata.biodataId);
  }, [favourites, biodata?.biodataId]);

  const hasApprovedContact = useMemo(() => {
    if (!Array.isArray(contactRequestsQuery.data) || !biodata?.biodataId) return false;
    return contactRequestsQuery.data.some(
      (request) =>
        String(request?.biodataId) === String(biodata.biodataId) &&
        String(request?.status).toLowerCase() === 'approved'
    );
  }, [contactRequestsQuery.data, biodata?.biodataId]);

  const contactVisible = Boolean(isPremiumMember || hasApprovedContact);

  const handleAddFavourite = async () => {
    if (!biodata?.biodataId) return;

    if (!user?.uid) {
      toast.info('Please log in to save favourites.');
      navigate('/login', { state: location?.pathname || '/biodatas' });
      return;
    }

    if (isAlreadyFavourite) {
      toast.info('This biodata is already in your favourites.');
      return;
    }

    try {
      const response = await addFavorite(biodata.biodataId);
      const message = response?.message || 'Biodata added to favourites';
      if (message.toLowerCase().includes('already')) {
        toast.info(message);
      } else {
        toast.success(message);
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      toast.error(apiMessage || 'Unable to update favourites right now. Please try again.');
    }
  };

  const handleRemoveFavourite = async () => {
    if (!biodata?.biodataId) return;

    try {
      const response = await removeFavorite(biodata.biodataId);
      const message = response?.message || 'Biodata removed from favourites';
      if (message.toLowerCase().includes('not')) {
        toast.info(message);
      } else {
        toast.success(message);
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      toast.error(apiMessage || 'Unable to update favourites right now. Please try again.');
    }
  };

  const handleRequestContact = () => {
    if (!biodata?.biodataId) return;
    navigate(`/checkout/${biodata.biodataId}`);
  };

  const formatDate = (value) => {
    try {
      return value
        ? new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Not provided';
    } catch {
      return value || 'Not provided';
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-bg-light)]/60 py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/biodatas"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-light-purple)]/40 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:border-[var(--color-primary-accent)] hover:text-[var(--color-primary-accent)]"
        >
          <FiArrowLeft /> Back to Biodatas
        </Link>

        <div className="mt-10 rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/90 p-8 shadow-sm">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/3 rounded bg-[var(--color-bg-light)]" />
              <div className="h-4 w-1/2 rounded bg-[var(--color-bg-light)]" />
              <div className="h-4 w-full rounded bg-[var(--color-bg-light)]" />
              <div className="h-4 w-2/3 rounded bg-[var(--color-bg-light)]" />
            </div>
          ) : (
            <>
              {isError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                  Failed to load biodata details. Showing showcase profile. ({error?.message || 'Network error'})
                </p>
              )}

              <header className="border-b border-[var(--color-light-purple)]/30 pb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-accent)]">
                  Biodata #{biodata.biodataId}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
                  {biodata.biodataType} Profile
                </h1>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--color-medium-gray)]">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin /> {biodata.permanentDivision || 'Division not set'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiBriefcase /> {biodata.occupation || 'Occupation pending'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiUser /> Age {biodata.age ?? '—'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar /> {formatDate(biodata.dateOfBirth)}
                  </span>
                </div>
              </header>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isAddingFavorite || isRemovingFavorite}
                  onClick={isAlreadyFavourite ? handleRemoveFavourite : handleAddFavourite}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  <FiHeart className="text-base" />
                  {isAddingFavorite || isRemovingFavorite
                    ? 'Saving…'
                    : isAlreadyFavourite
                    ? 'Remove from Favourites'
                    : 'Add to Favourites'}
                </button>

                {!contactVisible && (
                  <button
                    type="button"
                    onClick={handleRequestContact}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-accent)]/70 px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/60"
                  >
                    <FiShield className="text-base" /> Request Contact Information
                  </button>
                )}

                {contactVisible && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    <FiShield /> Premium Access Active
                  </span>
                )}
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-primary)]">Personal Information</h2>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--color-dark-gray)]">
                    <li><strong>Division:</strong> {biodata.permanentDivision}</li>
                    <li><strong>Present Division:</strong> {biodata.presentDivision || 'Will be added soon'}</li>
                    <li><strong>Age:</strong> {biodata.age ?? '—'} years</li>
                    <li><strong>Occupation:</strong> {biodata.occupation || 'Not provided'}</li>
                    <li><strong>Height:</strong> {biodata.height || 'Not provided'}</li>
                    <li><strong>Weight:</strong> {biodata.weight || 'Not provided'}</li>
                    <li><strong>Complexion:</strong> {biodata.race || 'Will be added soon'}</li>
                    <li><strong>Date of Birth:</strong> {formatDate(biodata.dateOfBirth)}</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-primary)]">Family & Preferences</h2>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--color-dark-gray)]">
                    <li><strong>Father&apos;s Name:</strong> {biodata.fatherName || 'Will be updated'}</li>
                    <li><strong>Mother&apos;s Name:</strong> {biodata.motherName || 'Will be updated'}</li>
                    <li><strong>Father&apos;s Occupation:</strong> {biodata.fatherOccupation || 'Will be updated'}</li>
                    <li><strong>Mother&apos;s Occupation:</strong> {biodata.motherOccupation || 'Will be updated'}</li>
                    <li><strong>Expected Partner Age:</strong> {biodata.expectedPartnerAge || 'Awaiting user input'}</li>
                    <li><strong>Expected Partner Height:</strong> {biodata.expectedPartnerHeight || 'Awaiting user input'}</li>
                    <li><strong>Expected Partner Weight:</strong> {biodata.expectedPartnerWeight || 'Awaiting user input'}</li>
                  </ul>
                </div>
              </div>

              <section className="mt-8 rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-6">
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">Story</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-dark-gray)]">
                  {biodata.about ||
                    'The biodata owner is preparing a detailed life story and preferences. Please check back soon or contact support for a prioritized update.'}
                </p>
              </section>

              <section className="mt-8 rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-6">
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">Contact Information</h2>
                {contactVisible ? (
                  <div className="mt-4 grid gap-4 text-sm text-[var(--color-dark-gray)] sm:grid-cols-2">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-light-purple)]/40 bg-white/80 px-4 py-3">
                      <FiMail className="text-[var(--color-primary-accent)]" /> {biodata.contactEmail || 'Email not provided'}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-light-purple)]/40 bg-white/80 px-4 py-3">
                      <FiPhone className="text-[var(--color-primary-accent)]" /> {biodata.mobileNumber || 'Phone not provided'}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-[var(--color-primary-accent)]/40 bg-white/80 px-6 py-4 text-sm text-[var(--color-medium-gray)]">
                    Premium members can view verified contact information instantly. Upgrade to premium or request contact access to proceed.
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <div className="mt-12 rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-primary-accent)]">Similar Profiles</p>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">You may also like</h2>
            </div>
            <Link to="/biodatas" className="text-sm font-semibold text-[var(--color-primary-accent)] hover:underline">
              View All Biodatas
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {similarBiodata.length === 0 ? (
              <p className="col-span-full text-sm text-[var(--color-medium-gray)]">
                More profiles will appear here once similar biodata are available.
              </p>
            ) : (
              similarBiodata.map((item) => <BiodataCard key={item.biodataId} biodata={item} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
