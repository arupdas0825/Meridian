'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Compass, Lock, Unlock, ShieldCheck, Check, Sparkles, Filter } from 'lucide-react';
import { europeDestinations } from '@/data/europeDestinations';
import { checkTravelEligibility, recalculateVerifiedSavings } from '@/shared/services/travelEligibilityService';
import { formatINR, formatEUR } from '@/shared/services/currencyService';
import { listCollection, createDoc } from '@/shared/lib/firestore';
import { toast } from 'sonner';

export default function EuropeExplorerPage() {
  const [durationMonths, setDurationMonths] = useState(1);
  const [tierFilter, setTierFilter] = useState('all');
  const [verifiedSavings, setVerifiedSavings] = useState(145000); // seed default from closed LedgerWise months
  const [walletBalance, setWalletBalance] = useState(85000);

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    // Read closed LedgerWise monthly summaries only
    const closedSummaries = await listCollection('ledgerwise', 'monthlySummaries');
    if (closedSummaries.length > 0) {
      const calculated = recalculateVerifiedSavings(closedSummaries);
      setVerifiedSavings(calculated);
    }
  };

  const filteredDestinations = europeDestinations.filter((d) => {
    if (tierFilter === 'all') return true;
    return d.tier === tierFilter;
  });

  const handleCreateGoal = async (destination) => {
    const budget = durationMonths === 1
      ? destination.budgetByDuration.oneMonth
      : durationMonths === 3
        ? destination.budgetByDuration.threeMonth
        : destination.budgetByDuration.sixMonth;

    const newGoal = {
      destinationId: destination.id,
      city: destination.city,
      country: destination.country,
      flagEmoji: destination.flagEmoji,
      durationMonths,
      targetAmount: budget,
      currentAmount: walletBalance,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await createDoc('atlas', 'goals', newGoal);
    toast.success(`Travel goal created for ${destination.city}, ${destination.country}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Verified Financial Balance */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-atlas-navy via-slate-900 to-slate-950 text-white space-y-4 shadow-xl border border-atlas-navy/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-atlas-gold text-slate-950">
                Atlas Travel Module
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Two-Number Money Model Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Europe Travel Explorer
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Browse 20 European destinations unlocked strictly by your verified LedgerWise savings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Verified Savings (LedgerWise)</span>
              <span className="text-lg font-bold text-atlas-gold">{formatINR(verifiedSavings)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Available Travel Wallet</span>
              <span className="text-lg font-bold text-slate-200">{formatINR(walletBalance)}</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Planned Duration:</span>
            {[1, 3, 6].map((months) => (
              <button
                key={months}
                onClick={() => setDurationMonths(months)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  durationMonths === months
                    ? 'bg-atlas-gold text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {months} {months === 1 ? 'Month' : 'Months'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {['all', 'easy', 'moderate', 'advanced'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-2.5 py-1 rounded-md capitalize text-[11px] font-medium transition-colors ${
                  tierFilter === tier
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((dest) => {
          const required = dest.minimumSavingsINR;
          const eligibility = checkTravelEligibility(verifiedSavings, required);
          const isUnlocked = eligibility.unlocked;

          const currentBudget =
            durationMonths === 1
              ? dest.budgetByDuration.oneMonth
              : durationMonths === 3
                ? dest.budgetByDuration.threeMonth
                : dest.budgetByDuration.sixMonth;

          return (
            <Card
              key={dest.id}
              className={`overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'border-atlas-gold/50 shadow-md hover:shadow-xl hover:-translate-y-1'
                  : 'border-border opacity-90'
              }`}
            >
              {/* Image Container with Lock Overlay */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden group">
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !isUnlocked ? 'filter desaturate-50 contrast-75 brightness-75' : ''
                  }`}
                  unoptimized
                />
                
                {/* Locked overlay gradient */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-900/90 border border-amber-500/40 flex items-center justify-center text-atlas-gold shadow-lg">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase text-amber-400">
                      Locked Destination
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Save {formatINR(eligibility.remaining)} more in LedgerWise
                    </span>
                  </div>
                )}

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-xl shadow-xs">{dest.flagEmoji}</span>
                  {isUnlocked ? (
                    <Badge variant="success" className="gap-1 shadow-md bg-emerald-500 text-white font-bold">
                      <Unlock className="w-3 h-3" /> Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-900/80 text-amber-400 border border-amber-400/30">
                      Requires {formatINR(dest.minimumSavingsINR)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Destination Card Body */}
              <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg leading-tight">{dest.city}</h3>
                    <span className="text-xs text-muted-foreground">{dest.country}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Est. Daily Cost: <span className="font-semibold text-foreground">{formatEUR(dest.estimatedDailyCostEUR)}</span>
                  </p>
                </div>

                {/* Progress Bar for Locked / Savings */}
                <div className="space-y-1.5 pt-2 border-t">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-muted-foreground">Savings Progress</span>
                    <span className={isUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600'}>
                      {eligibility.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-500' : 'bg-atlas-gold'
                      }`}
                      style={{ width: `${eligibility.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Budget for Selected Duration */}
                <div className="p-2.5 rounded-lg bg-muted/40 text-xs flex justify-between items-center">
                  <span className="text-muted-foreground">{durationMonths}M Est. Budget:</span>
                  <span className="font-bold text-foreground">{formatINR(currentBudget)}</span>
                </div>

                {/* CTA */}
                {isUnlocked ? (
                  <Button
                    onClick={() => handleCreateGoal(dest)}
                    variant="atlas"
                    className="w-full text-xs font-semibold gap-1.5 mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Start Travel Goal
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full text-xs text-muted-foreground cursor-not-allowed mt-2"
                  >
                    Locked ({formatINR(eligibility.remaining)} Left)
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
