'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Flame, CheckCircle2, Circle, Wallet, TrendingUp, BarChart3, PieChart as PieChartIcon, Receipt, CheckSquare } from 'lucide-react';
import { formatCurrency } from '@/shared/services/currencyService';
import { db } from '@/shared/lib/db';
import { cn } from '@/shared/lib/utils';

const CATEGORY_COLORS = {
  'Food & Dining': '#4C5FD7',
  'Transport': '#0FB6A6',
  'Shopping': '#C9A24B',
  'Rent & Utilities': '#EF6461',
  'Entertainment': '#8B5CF6',
  'Healthcare': '#F97316',
  'Travel Savings Transfer': '#1E2A4A',
};
const FALLBACK_COLOR = '#8B8FA3';

/** Group expenses by a key extractor. */
function groupBy(items, keyFn) {
  const map = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return map;
}

export default function UnifiedDashboardPage() {
  // Live Dexie queries — re-render automatically on any write
  const allTasks = useLiveQuery(() => db.tf_tasks.toArray(), []);
  const allExpenses = useLiveQuery(() => db.lw_expenses.toArray(), []);
  const wallet = useLiveQuery(() => db.atlas_wallet.get('main'), []);

  const tasks = allTasks ?? [];
  const expenses = allExpenses ?? [];

  // KPI: tasks completed today
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);

  // KPI: task streak — consecutive days with at least one completed task
  const streak = useMemo(() => {
    if (tasks.length === 0) return 0;
    const doneDates = [...new Set(
      tasks.filter(t => t.status === 'done' && t.createdAt)
        .map(t => t.createdAt.split('T')[0])
    )].sort().reverse();
    if (doneDates.length === 0) return 0;

    let count = 0;
    const msPerDay = 86400000;
    let check = new Date(todayStr);
    for (const d of doneDates) {
      const diff = Math.round((check - new Date(d)) / msPerDay);
      if (diff <= 1) { count++; check = new Date(d); }
      else break;
    }
    return count;
  }, [tasks, todayStr]);

  // Expense by category — pie chart
  const expenseByCategory = useMemo(() => {
    const grouped = groupBy(expenses, e => e.category || 'Other');
    return Object.entries(grouped).map(([name, items]) => ({
      name,
      value: items.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0),
      color: CATEGORY_COLORS[name] || FALLBACK_COLOR,
    }));
  }, [expenses]);

  const totalExpense = useMemo(() => expenseByCategory.reduce((s, c) => s + c.value, 0), [expenseByCategory]);

  // Weekly activity — bar chart (last 7 days)
  const weeklyActivity = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.createdAt?.startsWith(dateStr) && t.status === 'done').length;
      const dayExpense = expenses
        .filter(e => e.date === dateStr)
        .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
      days.push({ day: dayNames[d.getDay()], tasks: dayTasks, expense: dayExpense });
    }
    return days;
  }, [tasks, expenses]);

  const hasActivity = useMemo(() => weeklyActivity.some(d => d.tasks > 0 || d.expense > 0), [weeklyActivity]);

  // Pending tasks (not done, up to 5)
  const pendingTasks = useMemo(() =>
    tasks.filter(t => t.status !== 'done').slice(0, 5),
  [tasks]);

  // Recent expenses (up to 5)
  const recentExpenses = useMemo(() =>
    [...expenses].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5),
  [expenses]);

  return (
    <div className="space-y-6">
      {/* KPI strip with clear visual hierarchy in EUR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={`${streak} day${streak !== 1 ? 's' : ''}`}
          accentClass="bg-amber-500/15 text-amber-500"
        />
        <KpiCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Tasks Completed"
          value={completedToday}
          accentClass="bg-primary/15 text-primary"
          emphasis={true}
        />
        <KpiCard
          icon={<Wallet className="w-4 h-4" />}
          label="Total Expenses"
          value={formatCurrency(totalExpense)}
          accentClass="bg-teal-500/15 text-teal-600"
        />
        <KpiCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Verified Travel Savings"
          value={formatCurrency(wallet?.verifiedSavings ?? 0)}
          accentClass="bg-atlas-gold/15 text-atlas-gold"
          emphasis={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Weekly activity — bar chart, spans 2 cols */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-64 flex flex-col justify-center">
            {hasActivity ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ink-600)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--ink-600)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="tasks" fill="#4C5FD7" radius={[6, 6, 0, 0]} name="Tasks completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={CheckSquare}
                title="No activity yet"
                description="Complete tasks and log expenses to see your weekly activity here."
                actionLabel="Open TaskForge"
                actionHref="/taskforge/tasks"
              />
            )}
          </CardContent>
        </Card>

        {/* Expense breakdown — donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-500/15 text-teal-600 flex items-center justify-center">
                <PieChartIcon className="w-3.5 h-3.5" />
              </span>
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-64 flex flex-col items-center justify-center">
            {expenseByCategory.length > 0 ? (
              <>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                        {expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--line)', borderRadius: 12, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-ink-600 -mt-2">
                  Total: <span className="font-mono-data font-bold text-ink-900">{formatCurrency(totalExpense)}</span>
                </p>
              </>
            ) : (
              <EmptyState
                icon={Wallet}
                title="No expenses logged"
                description="Track your monthly budget and expenses in LedgerWise."
                actionLabel="Log an Expense"
                actionHref="/ledgerwise/expenses"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Live task list widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                <CheckSquare className="w-3.5 h-3.5" />
              </span>
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 min-h-[140px] flex flex-col justify-center">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <Circle className="w-4 h-4 text-ink-600 shrink-0" />
                  <span className="text-sm text-ink-900 truncate flex-1">{t.title}</span>
                  {t.dueDate && <span className="ml-auto text-[11px] text-ink-600 shrink-0">{t.dueDate}</span>}
                </div>
              ))
            ) : (
              <EmptyState
                icon={CheckSquare}
                title="All caught up"
                description="You have no pending tasks right now."
                actionLabel="Add a Task"
                actionHref="/taskforge/tasks"
              />
            )}
          </CardContent>
        </Card>

        {/* Live expense list widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-500/15 text-teal-600 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </span>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 min-h-[140px] flex flex-col justify-center">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <span className="text-sm text-ink-900 truncate flex-1">{tx.note || tx.category}</span>
                  <span className="ml-auto font-mono-data text-sm font-semibold text-destructive shrink-0">
                    -{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[11px] text-ink-600 w-16 text-right shrink-0">{tx.date}</span>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                description="Your logged spending and transfers will appear here."
                actionLabel="Open LedgerWise"
                actionHref="/ledgerwise/expenses"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, accentClass, emphasis = false }) {
  return (
    <Card className={cn('p-4 flex flex-col gap-2 transition-all', emphasis && 'ring-1 ring-inset ring-primary/20 bg-surface-1 shadow-e1')}>
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', accentClass)}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-ink-600 mb-0.5">{label}</p>
        <span className={cn('font-mono-data font-bold text-ink-900', emphasis ? 'text-2xl' : 'text-lg')}>{value}</span>
      </div>
    </Card>
  );
}
