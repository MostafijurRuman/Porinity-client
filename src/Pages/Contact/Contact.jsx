import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axiosNormal from '../../Hooks/axiosNormal'

const { div: MotionDiv } = motion

const channels = [
  {
    title: 'Premium Concierge',
    description: 'Dedicated advisory for premium biodata members with rapid follow-ups and curated introductions.',
    contact: 'concierge@porinity.com',
    badge: 'Under 2 Hours Response',
  },
  {
    title: 'Relationship Advisory',
    description: 'Schedule deep-dive sessions with senior counselors for guidance, family facilitation, and coaching.',
    contact: '+880 1234-567890',
    badge: 'By Appointment',
  },
  {
    title: 'Trust & Compliance',
    description: 'Report concerns, request verifications, or escalate privacy questions with our trust guardians.',
    contact: 'trust@porinity.com',
    badge: '24/7 Shield Desk',
  },
]

const studioDetails = [
  {
    city: 'Dhaka Flagship Studio',
    address: 'Level 12, Concord Ikebana, Gulshan Avenue, Dhaka 1212',
    hours: 'Saturday – Thursday: 10:00 AM – 8:00 PM',
  },
  {
    city: 'Global Virtual Lounge',
    address: 'Concierge sessions hosted on secure Porinity Meet suites.',
    hours: 'Worldwide availability with timezone-aware scheduling.',
  },
]

const faqs = [
  {
    q: 'How soon will a premium advisor reach out after I submit?',
    a: 'Within one business hour for premium members, and within the same business day for invited guests.',
  },
  {
    q: 'Can Porinity facilitate cross-border family meetings?',
    a: 'Yes. Our relationship managers coordinate bilingual introductions and logistics across 14 countries.',
  },
  {
    q: 'Is my story and information kept confidential?',
    a: 'Absolutely. Elevated encryption, NDAs, and the Porinity Pledge protect every narrative you entrust with us.',
  },
]

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      channel: formData.get('channel')?.toString() || 'concierge',
      message: formData.get('message')?.toString() || '',
    }

    payload.name = payload.name.trim()
    payload.email = payload.email.trim()
    payload.channel = payload.channel.trim() || 'concierge'
    payload.message = payload.message.trim()

    setFormStatus({ state: 'loading', message: '' })

      const { data } = await axiosNormal.post('/contact-messages', payload)
      setFormStatus({
        state: 'success',
        message: data?.message || 'Thank you. Your message is secured with our concierge team.',
      })
      event.currentTarget.reset()
     
  }

  return (
    <main className="relative overflow-hidden bg-[var(--color-bg-light)] text-[var(--color-dark-gray)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/8 via-transparent to-[var(--color-primary-accent)]/10 pointer-events-none" aria-hidden="true" />

      <section className="relative px-4 pt-24 pb-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/85 p-8 shadow-2xl backdrop-blur-lg md:p-12"
          >
            <span className="inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">Contact</span>
            <h1 className="mt-6 text-3xl font-bold text-[var(--color-primary)] md:text-5xl">Let&apos;s Elevate Your Matchmaking Journey</h1>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-medium-gray)] md:text-lg">
              Whether you&apos;re ready to begin a premium membership, need concierge guidance, or want to collaborate, the Porinity hospitality team is ready. Share your aspirations and we&apos;ll curate a response tailored to your story.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-[var(--color-primary)]">
              <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-4 py-2 font-semibold">Private Consultations</span>
              <span className="inline-flex items-center rounded-full bg-[var(--color-primary-accent)]/10 px-4 py-2 font-semibold">Discreet Communication</span>
              <span className="inline-flex items-center rounded-full bg-[var(--color-light-pink)]/10 px-4 py-2 font-semibold">Global Concierge</span>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-light-purple)] to-[var(--color-primary-accent)] p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-15" aria-hidden="true" />
            <div className="relative space-y-6">
              <h2 className="text-2xl font-semibold md:text-3xl">White-Glove Response Promise</h2>
              <p className="text-sm leading-relaxed text-white/80">
                Premium members receive direct hotline access, curated dossier reviews, and bilingual support for cross-border conversations. Our concierge keeps you informed at every step.
              </p>
              <ul className="space-y-3 text-sm font-medium">
                <li className="rounded-2xl bg-white/10 px-4 py-3 shadow-inner">Priority booking for familial meet-and-greets.</li>
                <li className="rounded-2xl bg-white/10 px-4 py-3 shadow-inner">Confidential document exchange with encryption vaults.</li>
                <li className="rounded-2xl bg-white/10 px-4 py-3 shadow-inner">Global timezone coverage with concierge hosts.</li>
              </ul>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="relative bg-white px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr,1.1fr]">
          <MotionDiv
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">Choose A Premium Channel</h2>
            <p className="text-base leading-relaxed text-[var(--color-medium-gray)]">
              We orchestrate responses with precision. Select your channel, share context, and our specialists will align the right relationship manager for you.
            </p>
            <div className="grid gap-4">
              {channels.map((channel) => (
                <MotionDiv
                  key={channel.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] p-5 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--color-primary)]">{channel.title}</h3>
                    <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">{channel.badge}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-medium-gray)]">{channel.description}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{channel.contact}</p>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] p-6 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Send A Confidential Message</h3>
            <p className="mt-3 text-sm text-[var(--color-medium-gray)]">Our concierge team replies with a bespoke roadmap aligned to your goals. Share as much context as you feel comfortable.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                  Full Name
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                  Email Address
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
                  />
                </label>
              </div>
              <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                Preferred Contact Channel
                <select
                  name="channel"
                  className="mt-2 rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
                  defaultValue="concierge"
                >
                  <option value="concierge">Premium Concierge</option>
                  <option value="relationship">Relationship Advisory</option>
                  <option value="trust">Trust & Compliance</option>
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-[var(--color-primary)]">
                Share Your Story
                <textarea
                  required
                  name="message"
                  rows="4"
                  placeholder="Tell us about your goals, timeline, or questions."
                  className="mt-2 resize-none rounded-xl border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-[var(--color-dark-gray)] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]/40"
                />
              </label>
              <button
                type="submit"
                disabled={formStatus.state === 'loading'}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:bg-[var(--color-light-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus.state === 'loading' ? 'Sending…' : 'Submit To Concierge Team'}
              </button>
            </form>
            {formStatus.state === 'success' && (
              <p className="mt-4 rounded-xl bg-[var(--color-primary)]/10 px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
                {formStatus.message}
              </p>
            )}
            {formStatus.state === 'error' && (
              <p className="mt-4 rounded-xl bg-[var(--color-error)]/10 px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
                {formStatus.message}
              </p>
            )}
          </MotionDiv>
        </div>
      </section>

      <section className="relative px-4 pb-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr,1.1fr]">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Flagship & Virtual Studios</h3>
            <p className="mt-3 text-sm text-[var(--color-medium-gray)]">Experience bespoke hospitality at our private studios or opt for curated virtual lounges designed for seamless conversations.</p>
            <div className="mt-6 space-y-5">
              {studioDetails.map((studio) => (
                <div key={studio.city} className="rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] px-5 py-4">
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">{studio.city}</h4>
                  <p className="mt-2 text-sm text-[var(--color-medium-gray)]">{studio.address}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-accent)]">{studio.hours}</p>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[var(--color-primary)]/10 bg-white p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Frequently Asked By Premium Families</h3>
            <div className="mt-6 space-y-4">
              {faqs.map((item) => (
                <details key={item.q} className="rounded-2xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-accent)]/40">{item.q}</summary>
                  <p className="mt-3 text-sm text-[var(--color-medium-gray)]">{item.a}</p>
                </details>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-light-purple)] to-[var(--color-primary-accent)] px-6 py-14 text-center text-white shadow-2xl md:px-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" aria-hidden="true" />
          <div className="relative space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">Conversations That Lead To Celebrations</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
              From the first hello to wedding planning, Porinity walks beside you. Share your aspirations and we&apos;ll choreograph the moments that matter.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <a
                href="tel:+8801234567890"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[var(--color-primary)] shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Call Premium Concierge
              </a>
              <a
                href="mailto:concierge@porinity.com"
                className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Email Our Advisory Suite
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
