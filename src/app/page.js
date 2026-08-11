import Link from 'next/link';
import { ArrowRight, CheckSquare, Wallet, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Meridian</h1>
            <p className="text-xs text-slate-400">Plan Smart. Save More. Explore Europe.</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="atlas" className="gap-2">
            Enter Platform <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Main Hero */}
      <main className="my-auto py-16 z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Single Auth & Two-Number Verified Savings Engine
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Your Productivity, Money & European Journeys in <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">One Unified Platform</span>
        </h2>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          TaskForge manages your goals. LedgerWise secures your budget. Atlas converts your verified financial savings into an honest map of unlockable European travel destinations.
        </p>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-blue-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">TaskForge</h3>
            <p className="text-xs text-slate-400">Tasks, projects, labels, analytics, and calendar integration.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-teal-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">LedgerWise</h3>
            <p className="text-xs text-slate-400">Income/expense tracking, budget engine, and verified monthly rollovers.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-100">Atlas</h3>
            <p className="text-xs text-slate-400">Savings-gated European travel explorer, goal tracking, and travel wallet.</p>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold px-8 hover:opacity-90 shadow-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 text-center text-xs text-slate-500 border-t border-slate-900 pt-6 max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span>Meridian Platform v1.0 &copy; 2026 Arup Das</span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
          <Link href="/taskforge/tasks" className="hover:text-slate-300">TaskForge</Link>
          <Link href="/ledgerwise/expenses" className="hover:text-slate-300">LedgerWise</Link>
          <Link href="/atlas/explore" className="hover:text-slate-300">Atlas</Link>
        </div>
      </footer>
    </div>
  );
}
