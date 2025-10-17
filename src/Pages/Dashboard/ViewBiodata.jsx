import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FiAlertTriangle, FiArrowRight, FiHash } from 'react-icons/fi';
import { TfiCrown } from "react-icons/tfi";
import { toast } from 'react-toastify';
import useMyBiodata from '../../Hooks/useMyBiodata';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

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
  const baseClasses = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide';
  switch (status) {
    case 'approved':
      return (
        <span className={`${baseClasses} bg-emerald-100 text-emerald-700`}>
          <TfiCrown /> Premium Approved
        </span>
      );
    case 'pending':
      return (
        <span className={`${baseClasses} bg-amber-100 text-amber-700`}>
          <TfiCrown /> Pending Premium Approval
        </span>
      );
    case 'rejected':
      return (
        <span className={`${baseClasses} bg-red-100 text-red-600`}>
          <TfiCrown /> Premium Rejected
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-[var(--color-bg-light)] text-[var(--color-primary)]`}>
          <TfiCrown /> Standard Biodata
        </span>
      );
  }
};

export default function ViewBiodata() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);

  const {
    data: biodata,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyBiodata({ retry: false });

  const premiumStatus = useMemo(() => biodata?.premiumStatus || 'none', [biodata?.premiumStatus]);

  const premiumMutation = useMutation({
    mutationFn: async () => {
      if (!biodata?.biodataId) {
        throw new Error('Biodata ID missing');
      }
      const { data } = await axiosSecure.post(`/biodata/${biodata.biodataId}/premium-request`);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Premium request submitted for review');
      setShowModal(false);
      refetch();
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to submit premium request';
      toast.error(message);
    },
  });

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

  const isPremiumButtonDisabled = premiumStatus === 'approved' || premiumStatus === 'pending';

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
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary-accent)]/60 px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <TfiCrown className="text-base" />
          {premiumStatus === 'approved'
            ? 'Already Premium'
            : premiumStatus === 'pending'
            ? 'Pending Approval'
            : 'Make Biodata Premium'}
        </button>
      </header>

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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-[var(--color-primary)]">Confirm Premium Request</h3>
            <p className="mt-2 text-sm text-[var(--color-medium-gray)]">
              Once submitted, our admin team will review your biodata for premium approval. You will be notified when the status changes.
            </p>
            <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <FiAlertTriangle className="mr-2 inline-block" /> Ensure your biodata is complete and accurate before requesting premium verification.
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[var(--color-light-purple)]/60 px-4 py-2 text-sm font-semibold text-[var(--color-dark-gray)] hover:bg-[var(--color-bg-light)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => premiumMutation.mutate()}
                disabled={premiumMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-70"
              >
                {premiumMutation.isPending ? 'Submitting…' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
