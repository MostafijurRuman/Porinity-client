import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FiArrowLeft, FiCreditCard, FiHash, FiMail, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAuth from '../../Hooks/UseAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const FEE_USD = 5;

const normalizeCardNumber = (value = '') => value.replace(/[^\d]/g, '').slice(0, 19);

export default function Checkout() {
  const { id: biodataIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth() || {};

  const biodataId = useMemo(() => biodataIdParam || location?.state?.biodataId || '', [biodataIdParam, location?.state?.biodataId]);
  const requesterEmail = user?.email || '';
  const requesterUid = user?.uid || '';

  useEffect(() => {
    if (!biodataId) {
      toast.error('Missing biodata reference. Redirecting to biodatas list.');
      navigate('/biodatas');
    }
  }, [biodataId, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      biodataId,
      email: requesterEmail,
      cardNumber: '',
    },
  });

  useEffect(() => {
    setValue('biodataId', biodataId);
  }, [biodataId, setValue]);

  useEffect(() => {
    setValue('email', requesterEmail);
  }, [requesterEmail, setValue]);

  const cardNumber = watch('cardNumber');

  const requestContactMutation = useMutation({
    mutationFn: async ({ cardNumber: rawCardNumber }) => {
      const sanitizedCard = normalizeCardNumber(rawCardNumber);
      const last4 = sanitizedCard.slice(-4);
      const payload = {
        biodataId,
        requesterEmail,
        requesterUid,
        amount: FEE_USD,
        currency: 'USD',
        paymentProvider: 'stripe',
        paymentMethod: 'card',
        cardLast4: last4,
        status: 'pending',
      };

      const { data } = await axiosSecure.post('/contact-requests', payload);
      return data;
    },
    onSuccess: (response) => {
      const message = response?.message || 'Contact request submitted for review.';
      toast.success(message);
      navigate('/dashboard', { state: { focusSection: 'myContactRequests' } });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to submit contact request. Please try again.';
      toast.error(message);
    },
  });

  const onSubmit = async (formData) => {
    const sanitizedCard = normalizeCardNumber(formData.cardNumber);
    if (sanitizedCard.length < 15) {
      toast.error('Please enter a valid card number.');
      return;
    }

    await requestContactMutation.mutateAsync({ cardNumber: sanitizedCard });
  };

  const formattedCard = useMemo(() => {
    const digits = normalizeCardNumber(cardNumber || '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }, [cardNumber]);

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
              Contact Information Request
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-primary)]">Checkout</h1>
            <p className="mt-3 text-sm text-[var(--color-medium-gray)]">
              Pay a one-time review fee to submit your contact information request. The admin team will verify and approve it.
            </p>
          </header>

          <div className="mt-6 rounded-2xl bg-[var(--color-bg-light)]/40 p-5 text-sm text-[var(--color-dark-gray)]">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
              <FiShield /> Request Summary
            </h2>
            <ul className="mt-3 space-y-1 text-[var(--color-medium-gray)]">
              <li>Requested Biodata ID: <span className="font-medium text-[var(--color-primary)]">{biodataId}</span></li>
              <li>Requester Email: <span className="font-medium text-[var(--color-primary)]">{requesterEmail || '—'}</span></li>
              <li>
                Review Fee: <span className="font-semibold text-[var(--color-primary-accent)]">${FEE_USD.toFixed(2)} USD</span>
              </li>
              <li>Status after submission: Pending admin approval</li>
            </ul>
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
                {...register('biodataId')}
              />
              {errors.biodataId && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.biodataId.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                <FiMail /> Your Email
              </label>
              <input
                type="email"
                readOnly
                className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-4 py-3 text-sm font-medium text-[var(--color-primary)] shadow-sm"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                <FiCreditCard /> Stripe Card Number
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
                The payment is processed securely via Stripe. We only store the last 4 digits for reference.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || requestContactMutation.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {requestContactMutation.isPending ? 'Processing Payment…' : `Pay $${FEE_USD.toFixed(2)} & Submit`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
