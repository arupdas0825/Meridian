'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { CheckSquare, Wallet, Compass, Smartphone } from 'lucide-react';
import { formatCurrency } from '@/shared/services/currencyService';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  const taskCount = useLiveQuery(() => db.tf_tasks.count(), []);
  const doneCount = useLiveQuery(() => db.tf_tasks.where('status').equals('done').count(), []);
  const expenseCount = useLiveQuery(() => db.lw_expenses.count(), []);
  const wallet = useLiveQuery(() => db.atlas_wallet.get('main'), []);
  const goalCount = useLiveQuery(() => db.atlas_goals.count(), []);

  useEffect(() => {
    db.app_meta.get('displayName').then((r) => setDisplayName(r?.value ?? ''));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  const saveDisplayName = async (value) => {
    setDisplayName(value);
    await db.app_meta.put({ key: 'displayName', value });
  };

  const initials = displayName?.trim()
    ? displayName.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ME';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-xs text-ink-600">This is a local, no-account profile — everything below lives only on this device.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-atlas-navy text-atlas-gold flex items-center justify-center font-bold text-xl border-2 border-atlas-gold shrink-0">
              {initials}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] text-ink-600 block">Display name (optional, shown only to you)</label>
              <Input
                value={displayName}
                onChange={(e) => saveDisplayName(e.target.value)}
                placeholder="Add a name"
                className="max-w-xs"
              />
            </div>
            <Badge variant={isStandalone ? 'default' : 'outline'} className="gap-1 shrink-0">
              <Smartphone className="w-3 h-3" /> {isStandalone ? 'Installed App' : 'Browser Tab'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<CheckSquare className="w-4 h-4 text-primary" />} label="Tasks Done" value={`${doneCount ?? 0}/${taskCount ?? 0}`} />
        <StatCard icon={<Wallet className="w-4 h-4 text-teal-600" />} label="Expenses Logged" value={expenseCount ?? 0} />
        <StatCard icon={<Compass className="w-4 h-4 text-atlas-gold" />} label="Travel Goals" value={goalCount ?? 0} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Verified Travel Savings</CardTitle></CardHeader>
        <CardContent>
          <p className="font-mono-data text-2xl font-extrabold text-atlas-gold">
            {formatCurrency(wallet?.verifiedSavings ?? 0)}
          </p>
          <p className="text-[11px] text-ink-600 mt-1">Derived only from closed LedgerWise months — never from manual wallet edits.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-ink-600 text-[11px]">{icon} {label}</div>
      <span className="font-mono-data text-lg font-bold text-ink-900">{value}</span>
    </Card>
  );
}
