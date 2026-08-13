'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Flame, CheckCircle2, Circle, Wallet, TrendingUp } from 'lucide-react';
import { formatINR } from '@/shared/services/currencyService';

// --- mock/seed data (swap for live Dexie/Firestore queries once wired) ---
const weeklyActivity = [
  { day: 'Mon', tasks: 4, expense: 1200 },
  { day: 'Tue', tasks: 6, expense: 800 },
  { day: 'Wed', tasks: 3, expense: 2400 },
  { day: 'Thu', tasks: 5, expense: 600 },
  { day: 'Fri', tasks: 7, expense: 1500 },
  { day: 'Sat', tasks: 2, expense: 3200 },
  { day: 'Sun', tasks: 1, expense: 900 },
];

const expenseByCategory = [
  { name: 'Food', value: 12500, color: '#4C5FD7' },
  { name: 'Transport', value: 6200, color: '#0FB6A6' },
  { name: 'Shopping', value: 9800, color: '#C9A24B' },
  { name: 'Bills', value: 15000, color: '#EF6461' },
  { name: 'Other', value: 4300, color: '#8B8FA3' },
];

const pendingTasks = [
  { id: 1, title: 'Research flight options', due: 'Today, 5:00 PM', done: false },
  { id: 2, title: 'Submit university transcript', due: 'Tomorrow', done: false },
  { id: 3, title: 'Update budget sheet', due: 'Fri', done: false },
  { id: 4, title: 'Call landlord', due: 'Sat', done: true },
];

const recentTransactions = [
  { id: 1, label: 'Groceries — Big Bazaar', amount: -1850, date: 'Today' },
  { id: 2, label: 'Freelance payment', amount: 8000, date: 'Yesterday' },
  { id: 3, label: 'Metro card recharge', amount: -500, date: '2 days ago' },
];

export default function UnifiedDashboardPage() {
  const totalExpense = useMemo(() => expenseByCategory.reduce((s, c) => s + c.value, 0), []);

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={<Flame className="w-4 h-4 text-amber-500" />} label="Streak" value="4 days" accent="amber" />
        <KpiCard icon={<CheckCircle2 className="w-4 h-4 text-primary" />} label="Completed Today" value="3" accent="primary" />
        <KpiCard icon={<Wallet className="w-4 h-4 text-teal-600" />} label="Net Savings" value={formatINR(75000)} accent="teal" />
        <KpiCard icon={<TrendingUp className="w-4 h-4 text-atlas-gold" />} label="Verified Travel Savings" value={formatINR(145000)} accent="gold" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Weekly activity — bar chart, spans 2 cols */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Weekly Activity</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ink-600)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-600)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="tasks" fill="#4C5FD7" radius={[6, 6, 0, 0]} name="Tasks completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense breakdown — donut */}
        <Card>
          <CardHeader><CardTitle className="text-base">Expense Breakdown</CardTitle></CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-ink-600 -mt-4">Total: <span className="font-mono-data font-bold text-ink-900">{formatINR(totalExpense)}</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Live task list widget */}
        <Card>
          <CardHeader><CardTitle className="text-base">Today &amp; Upcoming</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {pendingTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-2 transition-colors">
                {t.done
                  ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  : <Circle className="w-4 h-4 text-ink-600 shrink-0" />}
                <span className={cnLike(t.done)}>{t.title}</span>
                <span className="ml-auto text-[11px] text-ink-600 shrink-0">{t.due}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live expense list widget */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-2 transition-colors">
                <span className="text-sm text-ink-900">{tx.label}</span>
                <span className="ml-auto font-mono-data text-sm font-semibold shrink-0"
                      style={{ color: tx.amount > 0 ? '#0FB6A6' : '#EF6461' }}>
                  {tx.amount > 0 ? '+' : ''}{formatINR(tx.amount)}
                </span>
                <span className="text-[11px] text-ink-600 w-16 text-right shrink-0">{tx.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value }) {
  return (
    <Card className="p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-ink-600 text-[11px]">{icon} {label}</div>
      <span className="font-mono-data text-lg font-bold text-ink-900">{value}</span>
    </Card>
  );
}

function cnLike(done) {
  return done ? 'text-sm text-ink-600 line-through' : 'text-sm text-ink-900';
}
