import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FiArrowLeft, FiCheckCircle, FiCreditCard, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAuth from '../../Hooks/UseAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useUserAccount from '../../Hooks/useUserAccount';

const PREMIUM_USER_FEE = 50;
const normalizeCardNumber = (value = '') => value.replace(/[^\d]/g, '').slice(0, 19);

export default function PremiumUserCheckout() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth() || {};
  const { account, isLoadingAccount } = useUserAccount();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      cardNumber: '',
    },
  });

  useEffect(() => {
    setValue('email', user?.email || '');
  }, [user?.email, setValue]);

  const cardNumber = watch('cardNumber');

  const upgradeMutation = useMutation({
    mutationFn: async ({ cardNumber: rawCardNumber }) => {
      const digits = normalizeCardNumber(rawCardNumber);
      const last4 = digits.slice(-4);
      const payload = {
        amount: PREMIUM_USER_FEE,
        currency: 'USD',
        paymentProvider: 'stripe',
        paymentMethod: 'card',
        cardLast4: last4,
        transactionId: null,
      };

      const { data } = await axiosSecure.post('/users/premium-request', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Premium user request submitted.');
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Unable to submit request right now. Please try again later.';
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

  const userIsPremium = (account?.userType || '').toLowerCase() === 'premium';
  const requestPending = (account?.premiumUserStatus || '').toLowerCase() === 'pending';

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
              Premium User Membership
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-primary)]">Checkout</h1>
            <p className="mt-3 text-sm text-[var(--color-medium-gray)]">
              Become a premium member to unlock unlimited contact access and premium biodata submissions.
            </p>
          </header>

          <section className="mt-6 grid gap-4 rounded-2xl bg-[var(--color-bg-light)]/40 p-5 text-sm text-[var(--color-dark-gray)] sm:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
                <FiCheckCircle /> Premium Privileges
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--color-medium-gray)]">
                <li>View all biodata contact information instantly</li>
                <li>Submit your own biodata for premium review without extra fees</li>
                <li>Priority support and faster approvals</li>
              </ul>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
                <FiInfo /> Membership Summary
              </h2>
              <p className="mt-2">Account Email: <span className="font-medium text-[var(--color-primary)]">{user?.email || '—'}</span></p>
              <p className="mt-1">Current Status: <span className="font-medium text-[var(--color-primary)]">{account?.premiumUserStatus || 'none'}</span></p>
            </div>
          </section>

          {userIsPremium && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              You already have an active premium membership. Enjoy the benefits!
            </div>
          )}

          {requestPending && !userIsPremium && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
              Your premium membership request is currently pending. We will notify you once it is approved.
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-white/80 p-5 text-sm text-[var(--color-medium-gray)]">
            <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--color-primary)]">
              <FiCreditCard /> Secure Payment
            </h3>
            <p className="mt-2">Membership Fee: <span className="font-semibold text-[var(--color-primary-accent)]">${PREMIUM_USER_FEE.toFixed(2)} USD</span></p>
            <p className="mt-1">Premium access enables you to view all contact details without paying per biodata.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                Account Email
              </label>
              <input
                type="email"
                readOnly
                className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-4 py-3 text-sm font-medium text-[var(--color-primary)] shadow-sm"
                {...register('email', { required: 'Email is required.' })}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                Card Number
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
                We process payments securely and store only the last four digits for record keeping.
              </p>
            </div>

            <button
              type="submit"
              disabled={userIsPremium || requestPending || upgradeMutation.isPending || isLoadingAccount}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-accent)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {upgradeMutation.isPending ? 'Processing…' : `Pay $${PREMIUM_USER_FEE.toFixed(2)} & Upgrade`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
