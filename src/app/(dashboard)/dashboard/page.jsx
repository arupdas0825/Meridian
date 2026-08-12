'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { CheckSquare, Wallet, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { europeDestinations } from '@/data/europeDestinations';
import { formatINR } from '@/shared/services/currencyService';

export default function UnifiedDashboardPage() {
  // Mock/seed summary data for initial rendering
  const productivityStats = {
    completedToday: 3,
    totalPending: 5,
    streakDays: 4,
  };

  const financeStats = {
    monthlyIncome: 120000,
    monthlyExpenses: 45000,
    netSavings: 75000,
    closedMonthSavings: 145000,
  };

  const travelStats = {
    availableFunds: 85000,
    verifiedSavings: 145000, // from confirmed LedgerWise summaries
    unlockedDestinationsCount: europeDestinations.filter(
      d => d.minimumSavingsINR <= 145000
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-atlas-navy to-slate-900 text-white shadow-e3 border border-atlas-navy/50">
        {/* Subtle Meridian Line seam accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-meridian opacity-80" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-atlas-gold text-slate-950">
                Unified Platform
              </span>
              <span className="text-xs text-slate-300">Welcome back, Arup</span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
              Meridian Overview
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Tasks managed. Money tracked. European dreams within verified reach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/atlas/explore">
              <Button variant="atlas" size="sm" className="gap-1.5">
                <Compass className="w-4 h-4" /> Explore Europe
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The 3 Core Modules Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: TaskForge (Productivity) */}
        <Card className="border-primary/20 shadow-e1 hover:shadow-e2 transition-all relative overflow-hidden">
          <div className="h-1 bg-primary w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">TaskForge</CardTitle>
                  <CardDescription className="text-xs text-ink-600">Productivity Engine</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-2 rounded-xl">
              <div>
                <span className="text-[11px] text-ink-600 block">Completed Today</span>
                <span className="font-mono-data text-xl font-bold text-primary">{productivityStats.completedToday}</span>
              </div>
              <div>
                <span className="text-[11px] text-ink-600 block">Current Streak</span>
                <span className="font-mono-data text-xl font-bold text-amber-500 flex items-center gap-1">
                  {productivityStats.streakDays} days 🔥
                </span>
              </div>
            </div>

            <div className="text-xs text-ink-600 space-y-0.5">
              <p>• 5 tasks pending for today</p>
              <p>• Next deadline: &quot;Research flight options&quot; at 5:00 PM</p>
            </div>

            <Link href="/taskforge/tasks" className="block pt-2">
              <Button variant="outline" className="w-full justify-between text-xs">
                Open TaskForge <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: LedgerWise (Personal Finance) */}
        <Card className="border-teal-500/20 shadow-e1 hover:shadow-e2 transition-all relative overflow-hidden">
          <div className="h-1 bg-teal-500 w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">LedgerWise</CardTitle>
                  <CardDescription className="text-xs text-ink-600">Personal Finance</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-2 rounded-xl">
              <div>
                <span className="text-[11px] text-ink-600 block">Monthly Income</span>
                <span className="font-mono-data text-sm font-bold text-emerald-600">{formatINR(financeStats.monthlyIncome)}</span>
              </div>
              <div>
                <span className="text-[11px] text-ink-600 block">Net Savings</span>
                <span className="font-mono-data text-sm font-bold text-teal-600">{formatINR(financeStats.netSavings)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200">
              <span className="font-semibold block">Confirmed Rollover Savings:</span>
              <span className="font-mono-data text-base font-extrabold text-teal-600 dark:text-teal-400">
                {formatINR(financeStats.closedMonthSavings)}
              </span>
            </div>

            <Link href="/ledgerwise/expenses" className="block pt-2">
              <Button variant="outline" className="w-full justify-between text-xs">
                Open LedgerWise <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Atlas (Travel Module) */}
        <Card className="border-amber-500/20 shadow-e1 hover:shadow-e2 transition-all relative overflow-hidden">
          <div className="h-1 bg-amber-500 w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Atlas Travel</CardTitle>
                  <CardDescription className="text-xs text-ink-600">Europe Explorer</CardDescription>
                </div>
              </div>
              <Badge variant="atlas" className="font-mono-data">
                {travelStats.unlockedDestinationsCount} / {europeDestinations.length} Unlocked
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Verified Travel Savings:</span>
                <span className="font-mono-data font-bold text-amber-400">{formatINR(travelStats.verifiedSavings)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Available Wallet Funds:</span>
                <span className="font-mono-data font-bold text-slate-200">{formatINR(travelStats.availableFunds)}</span>
              </div>
            </div>

            <div className="text-xs text-ink-600 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-ink-900">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                Eligibility driven only by LedgerWise data
              </p>
              <p className="text-[11px]">Destinations unlocked: Rome, Berlin, Lisbon, Prague & 6 more!</p>
            </div>

            <Link href="/atlas/explore" className="block pt-2">
              <Button variant="atlas" className="w-full justify-between text-xs">
                Open Atlas Explorer <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

