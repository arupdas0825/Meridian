'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { CheckSquare, Wallet, Compass, ArrowRight, ShieldCheck, TrendingUp, Award, Calendar } from 'lucide-react';
import { europeDestinations } from '@/data/europeDestinations';
import { checkTravelEligibility, formatINR } from '@/shared/services/currencyService';

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-atlas-navy to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-atlas-gold text-slate-950">
              Unified Platform
            </span>
            <span className="text-xs text-slate-300">Welcome back, Arup</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
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

      {/* The 3 Core Modules Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: TaskForge (Productivity) */}
        <Card className="border-blue-500/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
          <div className="h-1.5 bg-blue-500 w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">TaskForge</CardTitle>
                  <CardDescription className="text-xs">Productivity Engine</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl">
              <div>
                <span className="text-[11px] text-muted-foreground block">Completed Today</span>
                <span className="text-xl font-bold text-blue-600">{productivityStats.completedToday}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Current Streak</span>
                <span className="text-xl font-bold text-amber-500 flex items-center gap-1">
                  {productivityStats.streakDays} days 🔥
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
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
        <Card className="border-teal-500/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
          <div className="h-1.5 bg-teal-500 w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">LedgerWise</CardTitle>
                  <CardDescription className="text-xs">Personal Finance</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl">
              <div>
                <span className="text-[11px] text-muted-foreground block">Monthly Income</span>
                <span className="text-sm font-bold text-emerald-600">₹{financeStats.monthlyIncome.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Net Savings</span>
                <span className="text-sm font-bold text-teal-600">₹{financeStats.netSavings.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200">
              <span className="font-semibold block">Confirmed Rollover Savings:</span>
              <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                ₹{financeStats.closedMonthSavings.toLocaleString()}
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
        <Card className="border-amber-500/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
          <div className="h-1.5 bg-amber-500 w-full top-0 left-0 absolute" />
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Atlas Travel</CardTitle>
                  <CardDescription className="text-xs">Europe Explorer</CardDescription>
                </div>
              </div>
              <Badge variant="atlas">
                {travelStats.unlockedDestinationsCount} / {europeDestinations.length} Unlocked
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Verified Travel Savings:</span>
                <span className="font-bold text-amber-400">₹{travelStats.verifiedSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Available Wallet Funds:</span>
                <span className="font-bold text-slate-200">₹{travelStats.availableFunds.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-foreground">
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
