'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { Moon, Sun, Monitor, Download, Upload, Trash2, Bell, HardDrive, Info } from 'lucide-react';
import { useThemeToggle } from '@/shared/lib/useThemeToggle';
import { db } from '@/shared/lib/db';
import { getConverterRates } from '@/shared/services/currencyService';
import { toast } from 'sonner';

function CurrencyConverterCard() {
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    setLoading(true);
    const data = await getConverterRates();
    setResult(data);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Currency Converter</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-ink-600">Reference only — Meridian itself always tracks and displays euros (€).</p>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-ink-900">€</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-28"
          />
          <Button size="sm" variant="outline" onClick={convert} disabled={loading}>
            {loading ? 'Fetching…' : 'Convert'}
          </Button>
        </div>
        {result?.rates && (
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            {Object.entries(result.rates).map(([code, rate]) => (
              <div key={code} className="p-2.5 rounded-lg bg-surface-2 text-center border border-line">
                <p className="text-ink-600 font-medium">{code}</p>
                <p className="font-mono-data font-bold text-ink-900 text-sm">{(amount * rate).toFixed(0)}</p>
              </div>
            ))}
          </div>
        )}
        {result?.rates && <p className="text-[10px] text-ink-600">Rates as of {result.asOf} (European Central Bank, via Frankfurter)</p>}
        {result?.error && <p className="text-[10px] text-amber-600">Couldn&apos;t fetch live rates right now — try again when online.</p>}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useThemeToggle();
  const [storageEstimate, setStorageEstimate] = useState(null);
  const [notifPermission, setNotifPermission] = useState('default');

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then(setStorageEstimate);
    }
    navigator.storage?.persist?.();
    if ('Notification' in window) setNotifPermission(Notification.permission);
  }, []);

  const requestNotifications = async () => {
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === 'granted') toast.success('Notifications enabled');
  };

  const handleExport = async () => {
    const snapshot = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        tf_tasks: await db.tf_tasks.toArray(),
        tf_projects: await db.tf_projects.toArray(),
        lw_expenses: await db.lw_expenses.toArray(),
        lw_monthlySummaries: await db.lw_monthlySummaries.toArray(),
        atlas_wallet: await db.atlas_wallet.toArray(),
        atlas_walletTx: await db.atlas_walletTx.toArray(),
        atlas_goals: await db.atlas_goals.toArray(),
        atlas_tripExpenses: await db.atlas_tripExpenses.toArray(),
      },
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup downloaded');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.schemaVersion !== 1) throw new Error('Unsupported backup version');
      await db.transaction('rw', db.tables, async () => {
        for (const [table, rows] of Object.entries(parsed.data)) {
          if (db[table] && Array.isArray(rows)) {
            await db[table].bulkPut(rows);
          }
        }
      });
      toast.success('Backup restored');
    } catch (err) {
      toast.error('Could not restore this file: ' + err.message);
    }
    e.target.value = '';
  };

  const handleClearAll = async () => {
    if (!confirm('This permanently deletes all local Meridian data on this device. This cannot be undone. Continue?')) return;
    await db.transaction('rw', db.tables, async () => {
      await Promise.all(db.tables.map((t) => t.clear()));
    });
    toast.success('All local data cleared');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs text-ink-600">No account, no cloud, no login — everything here controls this device only.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Monitor, label: 'System' },
          ].map(({ value, icon: Icon, label }) => (
            <Button key={value} variant={theme === value ? 'default' : 'outline'} size="sm" onClick={() => setTheme(value)} className="gap-1.5">
              <Icon className="w-3.5 h-3.5" /> {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <CurrencyConverterCard />

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-xs text-ink-600">Task deadline and travel-goal reminders (all generated and shown locally).</p>
          {notifPermission === 'granted' ? (
            <Badge>Enabled</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={requestNotifications}>Enable</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><HardDrive className="w-4 h-4" /> Data &amp; Backup</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {storageEstimate && (
            <p className="text-[11px] text-ink-600">
              Using {(storageEstimate.usage / 1024 / 1024).toFixed(2)} MB of local storage
              {storageEstimate.quota ? ` (of ~${(storageEstimate.quota / 1024 / 1024 / 1024).toFixed(1)} GB available)` : ''}.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Backup (.json)
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 relative">
              <Upload className="w-3.5 h-3.5" /> Import Backup
              <input type="file" accept="application/json" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader><CardTitle className="text-base text-red-600">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <Button size="sm" variant="destructive" onClick={handleClearAll} className="gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Clear All Local Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Info className="w-4 h-4" /> About</CardTitle></CardHeader>
        <CardContent className="text-xs text-ink-600 space-y-1">
          <p>Meridian — EUR-denominated local-first productivity, finance &amp; travel planning.</p>
          <p>No login, no tracking, no server ever sees your data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
