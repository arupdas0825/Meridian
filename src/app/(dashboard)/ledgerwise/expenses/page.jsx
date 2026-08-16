'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { Plus, Trash2, ArrowDownLeft, CalendarCheck, X, Wallet, Edit2, Check } from 'lucide-react';
import { useExpenses, addExpense, deleteExpense, closeMonth, useMonthSummaries } from '@/modules/ledgerwise/hooks/useExpenses';
import { useMonthlyBudget, setMonthlyBudget } from '@/modules/ledgerwise/hooks/useBudget';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { formatCurrency } from '@/shared/services/currencyService';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { summaries } = useMonthSummaries();
  const { budget, remaining, spent, yyyyMm, loading: budgetLoading } = useMonthlyBudget();

  const [budgetInput, setBudgetInput] = useState('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editBudgetInput, setEditBudgetInput] = useState('');

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('');
  const [showCloseMonth, setShowCloseMonth] = useState(false);
  const [closeMonthIncome, setCloseMonthIncome] = useState('');

  const isMonthClosed = summaries.some((s) => s.yyyyMm === yyyyMm && s.confirmed);

  const handleSetBudget = async (e) => {
    e?.preventDefault();
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid budget amount in euros (€)');
      return;
    }
    await setMonthlyBudget(yyyyMm, val);
    setBudgetInput('');
    toast.success(`Budget of ${formatCurrency(val)} set for ${yyyyMm}`);
  };

  const handleUpdateBudget = async () => {
    const val = parseFloat(editBudgetInput);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    await setMonthlyBudget(yyyyMm, val);
    setIsEditingBudget(false);
    toast.success(`Updated budget to ${formatCurrency(val)}`);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }

    await addExpense({
      category,
      amount: parsedAmount,
      note: note || category,
    });
    setAmount('');
    setNote('');
    toast.success(`Logged expense of ${formatCurrency(parsedAmount)}`);
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    toast.success('Expense deleted');
  };

  const handleCloseMonth = async () => {
    const parsedIncome = parseFloat(closeMonthIncome);
    if (isNaN(parsedIncome) || parsedIncome < 0) {
      toast.error('Please enter a valid income amount');
      return;
    }
    await closeMonth(yyyyMm, parsedIncome);
    setShowCloseMonth(false);
    setCloseMonthIncome('');
    toast.success(`Month ${yyyyMm} closed. Verified savings updated.`);
  };

  // If no budget set for this month yet, show the "Set Monthly Budget" prompt
  if (!budget) {
    return (
      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-900 dark:text-teal-100 font-heading text-center">
            LedgerWise
          </h1>
          <p className="text-xs text-ink-600 text-center mt-1">Rigorous personal finance and budget tracking</p>
        </div>

        <Card className="p-6 text-center space-y-5 border-teal-500/30 shadow-e2 bg-surface-1">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="font-bold text-lg font-display">Set {yyyyMm}&apos;s Budget</h2>
            <p className="text-xs text-ink-600 leading-relaxed">
              How much can you spend this month? Every expense you log will count down live from this budget.
            </p>
          </div>

          <form onSubmit={handleSetBudget} className="space-y-3">
            <div className="flex gap-2">
              <span className="flex items-center px-3.5 rounded-xl border border-line bg-surface-2 text-sm font-semibold text-ink-600">
                €
              </span>
              <Input
                type="number"
                step="any"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="2500"
                className="text-base font-mono-data"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5">
              Set Monthly Budget
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-900 dark:text-teal-100 font-heading">
            LedgerWise — Expense Tracker
          </h1>
          <p className="text-xs text-ink-600">Rigorous personal finance and reactive budget countdown</p>
        </div>

        <div className="flex items-center gap-3">
          {!isMonthClosed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCloseMonth(true)}
              className="gap-1.5 border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
            >
              <CalendarCheck className="w-3.5 h-3.5" /> Close This Month
            </Button>
          )}
          {isMonthClosed && (
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 gap-1 py-1 px-2.5">
              <CalendarCheck className="w-3 h-3" /> {yyyyMm} Closed
            </Badge>
          )}
        </div>
      </div>

      {/* Reactive Monthly Budget Display Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Remaining live animated card */}
        <Card className="p-5 border-teal-500/30 bg-surface-1 shadow-e1">
          <p className="text-[11px] text-ink-600 uppercase tracking-wider font-medium">Remaining This Month</p>
          <div className="mt-1">
            <AnimatedNumber
              value={remaining}
              formatter={(v) => formatCurrency(v)}
              className={`font-mono-data text-3xl font-extrabold ${
                remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'
              }`}
            />
          </div>
          <p className="text-[11px] text-ink-600 mt-2 flex items-center gap-1">
            <AnimatedNumber value={spent} formatter={(v) => formatCurrency(v)} /> spent of{' '}
            <span className="font-semibold">{formatCurrency(budget.totalBudget)}</span>
          </p>
        </Card>

        {/* Total Spent card */}
        <Card className="p-5 bg-surface-1 shadow-e1">
          <p className="text-[11px] text-ink-600 uppercase tracking-wider font-medium">Total Spent ({yyyyMm})</p>
          <div className="mt-1">
            <AnimatedNumber
              value={spent}
              formatter={(v) => formatCurrency(v)}
              className="font-mono-data text-3xl font-extrabold text-ink-900"
            />
          </div>
          <p className="text-[11px] text-ink-600 mt-2">
            {expenses.filter((e) => e.month === yyyyMm).length} logged transactions
          </p>
        </Card>

        {/* Total Budget Setting Card */}
        <Card className="p-5 bg-surface-1 shadow-e1 flex flex-col justify-between sm:col-span-2 md:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-ink-600 uppercase tracking-wider font-medium">Target Budget</p>
              {!isEditingBudget && (
                <button
                  onClick={() => {
                    setEditBudgetInput(budget.totalBudget.toString());
                    setIsEditingBudget(true);
                  }}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 inline-flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  value={editBudgetInput}
                  onChange={(e) => setEditBudgetInput(e.target.value)}
                  className="h-8 text-xs font-mono-data"
                  autoFocus
                />
                <Button size="sm" onClick={handleUpdateBudget} className="h-8 px-2.5 bg-teal-600 text-white">
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingBudget(false)}
                  className="h-8 px-2"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <p className="font-mono-data text-2xl font-bold text-ink-900 mt-1">
                {formatCurrency(budget.totalBudget)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-ink-600 mt-2">Budget active for month of {yyyyMm}</p>
        </Card>
      </div>

      {/* Close Month Dialog */}
      {showCloseMonth && (
        <Card className="border-teal-500/40 shadow-md bg-teal-500/5">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm font-display">Close Month: {yyyyMm}</h3>
              <button
                onClick={() => setShowCloseMonth(false)}
                className="text-ink-600 hover:text-ink-900 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-ink-600">
              Enter your total income for this month in euros (€). Net savings (income − expenses) will be verified
              and will automatically unlock European travel eligibility in Atlas.
            </p>
            <p className="text-xs text-ink-600">
              Total expenses this month:{' '}
              <span className="font-mono-data font-bold text-ink-900">{formatCurrency(spent)}</span>
            </p>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Monthly income (€) e.g. 3200"
                value={closeMonthIncome}
                onChange={(e) => setCloseMonthIncome(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleCloseMonth} className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
                <CalendarCheck className="w-4 h-4" /> Confirm &amp; Close
              </Button>
            </div>
            {closeMonthIncome && parseFloat(closeMonthIncome) >= 0 && (
              <p className="text-xs text-ink-600">
                Net savings:{' '}
                <span
                  className={`font-mono-data font-bold ${
                    parseFloat(closeMonthIncome) - spent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {formatCurrency(parseFloat(closeMonthIncome) - spent)}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Expense Card */}
      <Card className="border-teal-500/20 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                type="number"
                step="any"
                placeholder="Amount (€) e.g. 50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full font-mono-data"
                required
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 px-3 rounded-md border border-line text-xs bg-surface-0 text-ink-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Food & Dining">Food &amp; Dining</option>
              <option value="Rent & Utilities">Rent &amp; Utilities</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Travel Savings Transfer">Travel Savings Transfer</option>
            </select>
            <Input
              placeholder="Note / Description (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
              <Plus className="w-4 h-4" /> Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Expense History List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-teal-600" />
            Recent Expenses ({expenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {expensesLoading ? (
            <div className="py-8 text-center text-xs text-ink-600">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-600 space-y-1">
              <p className="font-semibold text-ink-900">No Expenses Yet</p>
              <p>Your financial activity will appear here as you log expenses in euros (€).</p>
            </div>
          ) : (
            expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface-1 hover:bg-teal-500/5 transition-colors group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-ink-900">{item.note || item.category}</span>
                    <Badge variant="outline" className="text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-ink-600 block">{item.date}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-sm text-destructive block font-mono-data">
                    -{formatCurrency(parseFloat(item.amount) || 0)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(item.id)}
                    className="p-1.5 rounded-md text-ink-600 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
