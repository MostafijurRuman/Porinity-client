import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FiArrowLeft, FiCreditCard, FiHash, FiShield, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useMyBiodata from '../../Hooks/useMyBiodata';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const PREMIUM_BIODATA_FEE = 10;

const normalizeCardNumber = (value = '') => value.replace(/[^\d]/g, '').slice(0, 19);

export default function PremiumBiodataCheckout() {
  const { id: biodataIdParam } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const {
    data: myBiodata,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyBiodata({ retry: false });

  const biodataId = useMemo(() => biodataIdParam || myBiodata?.biodataId || '', [biodataIdParam, myBiodata?.biodataId]);

  useEffect(() => {
    if (!biodataIdParam && myBiodata?.biodataId) {
      navigate(`/premium-biodata/${myBiodata.biodataId}`, { replace: true });
    }
  }, [biodataIdParam, myBiodata?.biodataId, navigate]);

  useEffect(() => {
    if (myBiodata && biodataId && myBiodata.biodataId !== biodataId) {
      toast.error('You can only upgrade your own biodata.');
      navigate('/dashboard/view-biodata', { replace: true });
    }
  }, [biodataId, myBiodata, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      biodataId,
      cardNumber: '',
    },
  });

  useEffect(() => {
    setValue('biodataId', biodataId);
  }, [biodataId, setValue]);

  const cardNumber = watch('cardNumber');

  const upgradeMutation = useMutation({
    mutationFn: async ({ cardNumber: rawCardNumber }) => {
      if (!biodataId) throw new Error('Missing biodata reference');
      const digits = normalizeCardNumber(rawCardNumber);
      const last4 = digits.slice(-4);
      const payload = {
        amount: PREMIUM_BIODATA_FEE,
        currency: 'USD',
        paymentProvider: 'stripe',
        paymentMethod: 'card',
        cardLast4: last4,
        transactionId: null,
      };

      const { data } = await axiosSecure.post(`/biodata/${biodataId}/premium-request`, payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Premium request submitted for review.');
      refetch();
      navigate('/dashboard/view-biodata', { replace: true });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to submit premium request. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = (formData) => {
    const digits = normalizeCardNumber(formData.cardNumber);
    if (digits.length < 15) {
      toast.error('Please enter a valid card number.');
      return;
    }
    upgradeMutation.mutate({ cardNumber: digits });
  };

  const formattedCard = useMemo(() => {
    const digits = normalizeCardNumber(cardNumber || '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }, [cardNumber]);

  if (isError) {
    return (
      <section className="min-h-screen bg-[var(--color-bg-light)]/80 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            Failed to load biodata info: {error?.message}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg-light)]/80 py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-light-purple)]/40 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:border-[var(--color-primary-accent)] hover:text-[var(--color-primary-accent)]"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="mt-10 rounded-3xl border border-[var(--color-light-purple)]/40 bg-white/90 p-8 shadow-sm">
          <header className="border-b border-[var(--color-light-purple)]/30 pb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-accent)]">
              Premium Biodata Upgrade
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-primary)]">Checkout</h1>
            <p className="mt-3 text-sm text-[var(--color-medium-gray)]">
              Unlock premium visibility for your biodata. Admins will verify your submission after payment.
            </p>
          </header>

          <section className="mt-6 grid gap-4 rounded-2xl bg-[var(--color-bg-light)]/40 p-5 text-sm text-[var(--color-dark-gray)] sm:grid-cols-2">
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
                <FiHash /> Summary
              </h2>
              <p>Biodata ID: <span className="font-medium text-[var(--color-primary)]">{biodataId || '—'}</span></p>
              <p>Status: <span className="font-medium text-[var(--color-primary)]">{myBiodata?.premiumStatus || 'none'}</span></p>
            </div>
            <div className="space-y-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
                <FiStar /> Premium Benefits
              </h2>
              <ul className="list-inside list-disc space-y-1 text-[var(--color-medium-gray)]">
                <li>Featured placement on the home page</li>
                <li>Priority in search results and recommendations</li>
                <li>Premium badge attached to your biodata</li>
              </ul>
            </div>
          </section>

          <div className="mt-6 rounded-2xl bg-white/80 p-5 text-sm text-[var(--color-medium-gray)]">
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
              <FiShield /> Payment Details
            </h3>
            <p className="mt-2">Upgrade Fee: <span className="font-semibold text-[var(--color-primary-accent)]">${PREMIUM_BIODATA_FEE.toFixed(2)} USD</span></p>
            <p className="mt-1">Premium badge will be applied once admins approve your biodata.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                <FiHash /> Biodata ID
              </label>
              <input
                type="text"
                readOnly
                className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-4 py-3 text-sm font-medium text-[var(--color-primary)] shadow-sm"
                {...register('biodataId', { required: 'Biodata ID is required.' })}
              />
              {errors.biodataId && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.biodataId.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                <FiCreditCard /> Card Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-4 py-3 text-sm text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary-accent)] focus:ring-2 focus:ring-[var(--color-primary-accent)]/50"
                value={formattedCard}
                {...register('cardNumber', {
                  onChange: (event) => {
                    const normalized = normalizeCardNumber(event.target.value);
                    setValue('cardNumber', normalized, { shouldValidate: true, shouldDirty: true });
                  },
                  validate: (value) => {
                    const digits = normalizeCardNumber(value);
                    if (!digits) return 'Card number is required.';
                    if (digits.length < 15) return 'Card number is incomplete.';
                    return true;
                  },
                })}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.cardNumber.message}</p>
              )}
              <p className="mt-2 text-xs text-[var(--color-medium-gray)]">
                Payments are processed securely. We store only the last 4 digits for verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={upgradeMutation.isPending || isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {upgradeMutation.isPending ? 'Processing…' : `Pay $${PREMIUM_BIODATA_FEE.toFixed(2)} & Submit`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
