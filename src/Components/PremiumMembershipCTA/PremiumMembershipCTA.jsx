import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiShield } from 'react-icons/fi';

export default function PremiumMembershipCTA() {
  return (
    <section className="relative mt-12 w-full overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] py-14 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full bg-white/30 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
            <FiShield className="text-sm" /> Premium Membership
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">Be a Premium User and Unlock Every Contact</h2>
          <p className="text-sm text-white/90 sm:text-base">
            Premium members view all biodata contact information instantly, submit premium biodatas without extra fees,
            and enjoy priority support. Upgrade your account for a one-time $50 membership fee.
          </p>
          <ul className="grid gap-3 text-sm text-white/90 sm:grid-cols-2">
            <li className="inline-flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 text-lg" />
              <span>Unlimited access to verified contact details</span>
            </li>
            <li className="inline-flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 text-lg" />
              <span>Submit your biodata for premium placement free of charge</span>
            </li>
            <li className="inline-flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 text-lg" />
              <span>Priority review and dedicated support</span>
            </li>
            <li className="inline-flex items-start gap-2">
              <FiCheckCircle className="mt-0.5 text-lg" />
              <span>Showcase badge to increase trust and responses</span>
            </li>
          </ul>
        </div>

        <div className="relative isolate w-full max-w-sm rounded-3xl border border-white/30 bg-white/10 p-6 backdrop-blur-sm">
          <div className="space-y-2 text-sm text-white/90">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Membership Fee</p>
            <p className="text-4xl font-extrabold text-white">$50 USD</p>
            <p className="text-sm">One-time payment. Premium access lasts as long as your account remains active.</p>
          </div>

          <Link
            to="/premium-user"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-md transition hover:bg-[var(--color-bg-light)]"
          >
            Upgrade Now <FiArrowRight />
          </Link>

          <p className="mt-4 text-[11px] text-white/70">
            Already submitted a request? Check your dashboard to monitor the approval status.
          </p>
        </div>
      </div>
    </section>
  );
}
