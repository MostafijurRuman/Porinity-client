import React from 'react'
import { motion } from 'framer-motion'

const { div: MotionDiv } = motion

const stats = [
  {
    label: 'Verified Biodatas',
    value: '12K+',
    detail: 'Profiles vetted with human moderation and intelligent screening.',
  },
  {
    label: 'Successful Matches',
    value: '3.4K',
    detail: 'Couples who discovered life partners through Porinity.',
  },
  {
    label: 'Avg. Match Time',
    value: '28 Days',
    detail: 'Smart recommendations accelerate meaningful introductions.',
  },
]

const pillars = [
  {
    title: 'Human-Centered Technology',
    description:
      'Sophisticated matching intelligence stays rooted in empathy, cultural nuance, and the realities of modern families.',
  },
  {
    title: 'Premium Trust Infrastructure',
    description:
      'Every premium biodata passes compliance, KYC, and a three-point verification before being featured to the community.',
  },
  {
    title: 'Celebrated Support Team',
    description:
      'Dedicated relationship managers guide members with curated recommendations and ongoing counseling.',
  },
]

const milestones = [
  {
    year: '2019',
    title: 'The Vision Ignites',
    detail: 'Porinity launches with a mission to modernize South Asian matchmaking without losing tradition.',
  },
  {
    year: '2021',
    title: 'Premium Ecosystem',
    detail: 'Introduced premium biodata curation, concierge assistance, and secured payment infrastructure.',
  },
  {
    year: '2023',
    title: 'Beyond Borders',
    detail: 'Expanded to diasporic communities in 14 countries while staying hyper-personalized.',
  },
  {
    year: 'Today',
    title: 'The Porinity Promise',
    detail: 'We deliver respectful, data-backed introductions that honor identity, values, and aspirations.',
  },
]

const leadership = [
  {
    name: 'Rumana Hossain',
    title: 'Founder & Chief Matchmaker',
    bio: '20+ years connecting families with an empathetic lens and bold innovation.',
  },
  {
    name: 'Arman Chowdhury',
    title: 'Head of Premium Experience',
    bio: 'Architect of Porinity concierge journeys and premium trust benchmarks.',
  },
  {
    name: 'Maya Rahman',
    title: 'Director of Member Success',
    bio: 'Leads the relationship advisory collective guiding couples to confident decisions.',
  },
]

export default function AboutUs() {
  return (
    <main className="relative overflow-hidden bg-[var(--color-bg-light)] text-[var(--color-dark-gray)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-light-pink)]/10 pointer-events-none" aria-hidden="true" />

      <section className="relative">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-24 md:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-lg md:p-12"
          >
            <span className="inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">Our Story</span>
            <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-[var(--color-primary)] md:text-5xl">Crafting Matches That Honor Legacy And Redefine Possibility</h1>
                <p className="text-base leading-relaxed text-[var(--color-medium-gray)] md:text-lg">
                  Porinity is the definitive premium matchmaking ecosystem designed for discerning families and professionals. We blend thoughtful human insights, curated experiences, and adaptive technology that celebrates identity, ambition, and heart.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-[var(--color-primary)]">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-4 py-2 font-semibold">Premium Biodata Concierge</span>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-primary-accent)]/10 px-4 py-2 font-semibold">Relationship Advisory</span>
                  <span className="inline-flex items-center rounded-full bg-[var(--color-light-pink)]/10 px-4 py-2 font-semibold">Culturally Fluent Technology</span>
                </div>
              </div>
              <div className="grid gap-4 text-sm text-[var(--color-medium-gray)]">
                {pillars.map((pillar) => (
                  <MotionDiv
                    key={pillar.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="group rounded-2xl border border-transparent bg-[var(--color-primary)]/6 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:bg-white"
                  >
                    <h3 className="text-lg font-semibold text-[var(--color-primary)]">{pillar.title}</h3>
                    <p className="mt-2 leading-relaxed">{pillar.description}</p>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--color-primary)]/10 bg-white/70 p-6 text-center shadow-lg backdrop-blur">
                <p className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">{item.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">{item.label}</p>
                <p className="mt-3 text-sm text-[var(--color-medium-gray)]">{item.detail}</p>
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[1.1fr,0.9fr] md:px-8">
          <MotionDiv initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">What Sets Porinity Apart</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-medium-gray)]">
              The Porinity approach was developed with matchmakers, technologists, counselors, and cultural scholars. We honor the trust families place in us by delivering discreet, personalized introductions and data-backed decision support.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-[var(--color-medium-gray)]">
              <li className="flex items-start gap-3 rounded-xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] px-4 py-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
                <span>Concierge onboarding interviews map values, vision, and compatibility markers unique to each family.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] px-4 py-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[var(--color-primary-accent)]" aria-hidden="true" />
                <span>Premium biodata showcases highlight verified achievements with beautifully curated visual storytelling.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] px-4 py-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-[var(--color-light-pink)]" aria-hidden="true" />
                <span>Holistic post-match support offers counseling, family facilitation, and celebratory events planning.</span>
              </li>
            </ul>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-light-purple)] p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" aria-hidden="true" />
            <div className="relative space-y-6">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Premium Member Commitments</h3>
              <p className="text-sm leading-relaxed text-white/80">
                We champion privacy, integrity, and empowerment. Every premium member signs the Porinity Pledge — a promise to communicate with respect, protect shared information, and show up with honesty.
              </p>
              <div className="grid gap-5 text-sm font-medium">
                <div className="rounded-2xl bg-white/10 p-4 shadow-inner">Transparent intentions and open-hearted conversations.</div>
                <div className="rounded-2xl bg-white/10 p-4 shadow-inner">Support for inclusive, intergenerational decision-making.</div>
                <div className="rounded-2xl bg-white/10 p-4 shadow-inner">Momentum towards commitments that honor shared values.</div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">Milestones On Our Journey</h2>
            <p className="mt-4 text-base text-[var(--color-medium-gray)] md:text-lg">Each chapter represents thousands of stories, heartfelt conversations, and extraordinary unions.</p>
          </div>
          <div className="relative">
            <span className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-primary)]/20 via-[var(--color-primary-accent)]/40 to-transparent md:block" aria-hidden="true" />
            <div className="space-y-10 md:space-y-0">
              {milestones.map((milestone, index) => (
                <MotionDiv
                  key={milestone.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-10' : 'md:pr-10'}`}
                >
                  <div className="rounded-2xl border border-[var(--color-primary)]/10 bg-white p-6 shadow-xl">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">{milestone.year}</span>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--color-primary)]">{milestone.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-medium-gray)]">{milestone.detail}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">Leadership Dedicated To You</h2>
            <p className="mt-3 text-base text-[var(--color-medium-gray)]">Our senior advisors orchestrate every premium journey with sensitivity and precision.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {leadership.map((member) => (
              <MotionDiv
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-[var(--color-primary)]/10 bg-[var(--color-bg-light)] p-6 text-center shadow-lg"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-light-pink)]/40 text-3xl font-bold text-[var(--color-primary)]">
                  {member.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">{member.name}</h3>
                <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-primary-accent)]">{member.title}</p>
                <p className="mt-3 text-sm text-[var(--color-medium-gray)]">{member.bio}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-light-purple)] to-[var(--color-primary-accent)] px-6 py-14 text-center text-white shadow-2xl md:px-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" aria-hidden="true" />
          <div className="relative space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">Your Love Story Deserves A Premium Stage</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
              Join a curated circle that celebrates aspiration with authenticity. Our matchmakers are ready to learn your story, honor your values, and introduce you to partners who are aligned for life.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <a
                href="/register"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-[var(--color-primary)] shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Start Your Premium Journey
              </a>
              <a
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-white transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Speak To A Relationship Manager
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
