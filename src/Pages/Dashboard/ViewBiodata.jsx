import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiHash, FiInfo } from 'react-icons/fi';
import { TfiCrown } from 'react-icons/tfi';
import useMyBiodata from '../../Hooks/useMyBiodata';

const PREMIUM_BIODATA_PRICE = 10;

const formatDate = (value) => {
  if (!value) return 'Not provided';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return value;
  }
};

const PremiumBadge = ({ status }) => {
  const normalized = (status || 'none').toLowerCase();
  const baseClasses = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide';

  if (normalized === 'approved') {
    return (
      <span className={`${baseClasses} bg-emerald-100 text-emerald-700`}>
        <TfiCrown /> Premium Biodata
      </span>
    );
  }

  if (normalized === 'pending') {
    return (
      <span className={`${baseClasses} bg-amber-100 text-amber-700`}>
        <TfiCrown /> Pending Review
      </span>
    );
  }

  if (normalized === 'rejected') {
    return (
      <span className={`${baseClasses} bg-red-100 text-red-600`}>
        <TfiCrown /> Premium Rejected
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-[var(--color-bg-light)] text-[var(--color-primary)]`}>
      <TfiCrown /> Standard Biodata
    </span>
  );
};

export default function ViewBiodata() {
  const navigate = useNavigate();

  const {
    data: biodata,
    isLoading,
    isError,
    error,
  } = useMyBiodata({ retry: false });

  const premiumStatus = useMemo(
    () => (biodata?.premiumStatus ? String(biodata.premiumStatus).toLowerCase() : 'none'),
    [biodata?.premiumStatus]
  );

  const premiumPayment = useMemo(() => biodata?.premiumPayment || null, [biodata?.premiumPayment]);

  const isPremiumButtonDisabled = premiumStatus === 'approved' || premiumStatus === 'pending';

  const premiumButtonLabel = useMemo(() => {
    switch (premiumStatus) {
      case 'approved':
        return 'Premium Badge Active';
      case 'pending':
        return 'Premium Request Pending';
      case 'rejected':
        return 'Resubmit Premium Request';
      default:
        return 'Upgrade Biodata to Premium';
    }
  }, [premiumStatus]);

  const premiumHelper = useMemo(() => {
    switch (premiumStatus) {
      case 'approved':
        return {
          tone: 'success',
          title: 'Premium biodata is live',
          message: 'Your biodata is featured across the platform with increased visibility.',
        };
      case 'pending': {
        const amount = premiumPayment?.amount ?? PREMIUM_BIODATA_PRICE;
        const cardTail = premiumPayment?.cardLast4 ? ` Payment card ending in ••••${premiumPayment.cardLast4}.` : '';
        return {
          tone: 'warning',
          title: 'Awaiting admin review',
          message: `We received your $${Number(amount).toFixed(2)} premium biodata request. Our team will approve it shortly.${cardTail}`,
        };
      }
      case 'rejected':
        return {
          tone: 'danger',
          title: 'Premium request was rejected',
          message: 'Update your biodata details and try submitting another premium request.',
        };
      default:
        return {
          tone: 'info',
          title: 'Stand out with a premium biodata',
          message:
            'Premium biodatas appear on the homepage, gain priority search placement, and attract more contact requests.',
        };
    }
  }, [premiumStatus, premiumPayment?.amount, premiumPayment?.cardLast4]);

  const gotoPremiumCheckout = () => {
    if (!biodata?.biodataId) return;
    navigate(`/premium-biodata/${biodata.biodataId}`);
  };

  if (isLoading) {
    return <p>Loading biodata details…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load biodata: {error?.message}</p>;
  }

  if (!biodata) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="rounded-xl border border-[var(--color-light-purple)]/40 bg-[var(--color-bg-light)]/70 px-4 py-3 text-sm text-[var(--color-dark-gray)]">
          You have not created a biodata yet. Complete your biodata to access premium features.
        </div>
        <button
          type="button"
          onClick={() => navigate('../edit-biodata')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-5 py-2 text-sm font-semibold text-white shadow"
        >
          <FiArrowRight /> Create Biodata Now
        </button>
      </div>
    );
  }

  const detailItems = [
    { label: 'Biodata Type', value: biodata.biodataType },
    { label: 'Name', value: biodata.name },
    { label: 'Date of Birth', value: formatDate(biodata.dateOfBirth) },
    { label: 'Height', value: biodata.height },
    { label: 'Weight', value: biodata.weight },
    { label: 'Age', value: biodata.age },
    { label: 'Occupation', value: biodata.occupation },
    { label: 'Race / Complexion', value: biodata.race },
    { label: "Father's Name", value: biodata.fatherName },
    { label: "Mother's Name", value: biodata.motherName },
    { label: 'Permanent Division', value: biodata.permanentDivision },
    { label: 'Present Division', value: biodata.presentDivision },
    { label: 'Expected Partner Age', value: biodata.expectedPartnerAge },
    { label: 'Expected Partner Height', value: biodata.expectedPartnerHeight },
    { label: 'Expected Partner Weight', value: biodata.expectedPartnerWeight },
    { label: 'Contact Email', value: biodata.contactEmail },
    { label: 'Mobile Number', value: biodata.mobileNumber },
  ];

  const helperToneClasses = {
    info: 'border-[var(--color-primary)]/20 bg-[var(--color-bg-light)]/70 text-[var(--color-dark-gray)]',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-light-purple)]/40 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">My Biodata</h2>
          <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
            Review the biodata details that visitors will see. Keep information accurate for faster verification.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-light)]/70 px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">
              <FiHash /> Biodata ID: {biodata.biodataId}
            </span>
            <PremiumBadge status={premiumStatus} />
          </div>
        </div>
        <button
          type="button"
          disabled={isPremiumButtonDisabled}
          onClick={gotoPremiumCheckout}
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold transition ${
            isPremiumButtonDisabled
              ? 'border-[var(--color-light-purple)]/60 text-[var(--color-medium-gray)] cursor-not-allowed opacity-70'
              : 'border-[var(--color-primary-accent)]/60 text-[var(--color-primary)] hover:bg-[var(--color-primary-accent)] hover:text-white'
          }`}
        >
          <TfiCrown className="text-base" />
          {premiumButtonLabel}
        </button>
      </header>

      {premiumHelper && (
        <div className={`flex gap-3 rounded-2xl border px-5 py-4 text-sm ${helperToneClasses[premiumHelper.tone]}`}>
          <FiInfo className="mt-0.5 text-base" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">{premiumHelper.title}</p>
            <p className="mt-1 text-sm leading-relaxed">{premiumHelper.message}</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {detailItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--color-dark-gray)]">
              {item.value || 'Not provided'}
            </p>
          </div>
        ))}
      </div>

      {biodata.about && (
        <section className="rounded-2xl border border-[var(--color-light-purple)]/30 bg-[var(--color-bg-light)]/50 p-6">
          <h3 className="text-lg font-semibold text-[var(--color-primary)]">Story</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-dark-gray)]">{biodata.about}</p>
        </section>
      )}
    </div>
  );
}
