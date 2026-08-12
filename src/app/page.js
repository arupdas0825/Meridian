import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckSquare, Wallet, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 text-ink-900 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Meridian Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain shrink-0"
          />
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-ink-900">Meridian</h1>
            <p className="text-xs text-ink-600">Plan Smart. Save More. Explore Europe.</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="meridian" className="gap-2">
            Enter Platform <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>


      {/* Main Hero */}
      <main className="my-auto py-16 z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs text-ink-900">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Single Auth & Two-Number Verified Savings Engine
        </div>

        <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-ink-900">
          Your Productivity, Money & European Journeys in <span className="bg-meridian bg-clip-text text-transparent">One Unified Platform</span>
        </h2>

        <p className="text-ink-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          TaskForge manages your goals. LedgerWise secures your budget. Atlas converts your verified financial savings into an honest map of unlockable European travel destinations.
        </p>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-6 rounded-2xl bg-surface-1 border border-line space-y-3 hover:border-primary/50 transition-colors shadow-e1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink-900">TaskForge</h3>
            <p className="text-xs text-ink-600">Tasks, projects, labels, analytics, and calendar integration.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-line space-y-3 hover:border-teal-500/50 transition-colors shadow-e1">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink-900">LedgerWise</h3>
            <p className="text-xs text-ink-600">Income/expense tracking, budget engine, and verified monthly rollovers.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-line space-y-3 hover:border-amber-500/50 transition-colors shadow-e1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-atlas-gold flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-ink-900">Atlas</h3>
            <p className="text-xs text-ink-600">Savings-gated European travel explorer, goal tracking, and travel wallet.</p>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/dashboard">
            <Button size="lg" variant="meridian" className="px-8 shadow-e2">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 text-center text-xs text-ink-600 border-t border-line pt-6 max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-mono-data">Meridian Platform v2.0 &copy; 2026 Arup Das</span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-ink-900 transition-colors">Dashboard</Link>
          <Link href="/taskforge/tasks" className="hover:text-ink-900 transition-colors">TaskForge</Link>
          <Link href="/ledgerwise/expenses" className="hover:text-ink-900 transition-colors">LedgerWise</Link>
          <Link href="/atlas/explore" className="hover:text-ink-900 transition-colors">Atlas</Link>
        </div>
      </footer>
    </div>
  );
}

