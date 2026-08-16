'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CheckSquare, Wallet, Compass, Lock, Smartphone, Sparkles } from 'lucide-react';
import { AmbientVideo } from '@/shared/ui/AmbientVideo';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LandingPage() {
  return (
    <div className="bg-surface-0 text-ink-900 overflow-x-hidden min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-surface-0/70 border-b border-line">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/icon.png" alt="Meridian" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-lg tracking-tight font-display">Meridian</span>
          </div>
          <Link href="/dashboard">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-line bg-surface-1 text-sm font-semibold shadow-e1 hover:bg-surface-2 transition-colors cursor-pointer"
            >
              Enter Platform <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </div>
      </nav>

      {/* HERO — viewport height with cinematic ambient video integration */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Layer 0 & 1: Cinematic Ambient Video + Radial Readability Mask */}
        <AmbientVideo />

        {/* Layer 2: Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-line bg-surface-1 text-xs font-medium mb-6 shadow-e1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> No login. No tracking. 100% local-first.
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] font-display"
          >
            Your Productivity, Money &amp; European Journeys in{' '}
            <span style={{ backgroundImage: 'var(--meridian-gradient)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              One Unified Platform
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-xl text-ink-600 text-base md:text-lg leading-relaxed"
          >
            TaskForge manages your goals. LedgerWise secures your budget. Atlas turns verified
            savings into an honest map of unlockable European destinations.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link href="/dashboard">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-e2 cursor-pointer"
                style={{ background: 'var(--meridian-gradient)' }}
              >
                Start Planning Free <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 1.6 } }}
          className="absolute bottom-8 z-10 text-ink-600 text-xs font-medium flex flex-col items-center gap-1 pointer-events-none"
        >
          Scroll to explore ↓
        </motion.div>
      </section>

      {/* MODULE SHOWCASE — full, never cut off */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-center mb-4 font-display"
        >
          Three Systems. Perfectly Separated.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-center text-ink-600 max-w-xl mx-auto mb-14 text-sm md:text-base"
        >
          Integrated, never merged. Each module keeps its own identity — you always know exactly where you are.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckSquare,
              name: 'TaskForge',
              tag: 'Productivity Engine',
              color: 'bg-primary/15 text-primary',
              desc: 'Tasks, deadlines, and streaks — a fast, distraction-free productivity system.',
            },
            {
              icon: Wallet,
              name: 'LedgerWise',
              tag: 'Personal Finance',
              color: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
              desc: 'Monthly budgets, expense tracking, and a real "Close Month" ritual that verifies your savings.',
            },
            {
              icon: Compass,
              name: 'Atlas',
              tag: 'Europe Explorer',
              color: 'bg-atlas-gold/15 text-atlas-gold',
              desc: 'Verified savings unlock real European destinations — an honest, gamified travel planner.',
            },
          ].map((m, i) => (
            <motion.div
              key={m.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-line bg-surface-1 p-6 shadow-e1 transition-all hover:shadow-e2"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-display mb-1">{m.name}</h3>
              <p className="text-xs text-ink-600 mb-3">{m.tag}</p>
              <p className="text-sm text-ink-600 leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY MERIDIAN — differentiators, grounded in real architecture */}
      <section className="bg-surface-1 border-y border-line py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-center mb-14 font-display"
          >
            Why Meridian
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'Your data never leaves your device',
                desc: 'No account, no server-side profile — everything lives in your browser, exportable anytime.',
              },
              {
                icon: Sparkles,
                title: 'Honest eligibility, not vibes',
                desc: 'Destinations unlock from verified closed-month savings only — never a manually edited number.',
              },
              {
                icon: Smartphone,
                title: 'A real installable app',
                desc: 'Add it to your home screen — works offline, feels native, updates instantly.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-surface-2 flex items-center justify-center mb-4 border border-line">
                  <f.icon className="w-5 h-5 text-ink-600" />
                </div>
                <h3 className="font-semibold text-base mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold mb-4 font-display"
        >
          Start planning your move to Europe today.
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.5}
          className="text-ink-600 text-sm md:text-base mb-8 max-w-lg mx-auto"
        >
          Empower your workflow, master your monthly budget, and unlock European destinations with verified financial confidence.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          <Link href="/dashboard">
            <span
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white shadow-e2 hover:shadow-e3 transition-shadow cursor-pointer"
              style={{ background: 'var(--meridian-gradient)' }}
            >
              Enter Meridian <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-ink-600 bg-surface-0">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Meridian" className="w-5 h-5 rounded" />
            <span className="font-semibold text-ink-900">Meridian</span>
            <span>— Plan Smart. Save More. Explore Europe.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/dashboard" className="hover:text-ink-900 transition-colors">Dashboard</Link>
            <Link href="/taskforge/tasks" className="hover:text-ink-900 transition-colors">TaskForge</Link>
            <Link href="/ledgerwise/expenses" className="hover:text-ink-900 transition-colors">LedgerWise</Link>
            <Link href="/atlas/explore" className="hover:text-ink-900 transition-colors">Atlas</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
