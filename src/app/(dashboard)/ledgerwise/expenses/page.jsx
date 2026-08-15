'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { Plus, Trash2, ArrowDownLeft, CalendarCheck, X } from 'lucide-react';
import { useExpenses, addExpense, deleteExpense, closeMonth, useMonthSummaries } from '@/modules/ledgerwise/hooks/useExpenses';
import { formatCurrency } from '@/shared/services/currencyService';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const { expenses, loading } = useExpenses();
  const { summaries } = useMonthSummaries();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('');
  const [showCloseMonth, setShowCloseMonth] = useState(false);
  const [closeMonthIncome, setCloseMonthIncome] = useState('');

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

  const currentMonth = new Date().toISOString().slice(0, 7);
  const isMonthClosed = summaries.some(s => s.yyyyMm === currentMonth && s.confirmed);
  const totalSpent = expenses
    .filter(e => e.month === currentMonth)
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const handleCloseMonth = async () => {
    const parsedIncome = parseFloat(closeMonthIncome);
    if (isNaN(parsedIncome) || parsedIncome < 0) {
      toast.error('Please enter a valid income amount');
      return;
    }
    await closeMonth(currentMonth, parsedIncome);
    setShowCloseMonth(false);
    setCloseMonthIncome('');
    toast.success(`Month ${currentMonth} closed. Verified savings updated.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-900 dark:text-teal-100 font-heading">
            LedgerWise — Expense Tracker
          </h1>
          <p className="text-xs text-muted-foreground">Rigorous personal finance and budget tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-800 dark:text-teal-200 text-right">
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">This Month&apos;s Expenses</span>
            <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400 block">{formatCurrency(totalSpent)}</span>
          </div>

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
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 gap-1">
              <CalendarCheck className="w-3 h-3" /> {currentMonth} Closed
            </Badge>
          )}
        </div>
      </div>

      {/* Close Month Dialog */}
      {showCloseMonth && (
        <Card className="border-teal-500/40 shadow-md bg-teal-500/5">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Close Month: {currentMonth}</h3>
              <button onClick={() => setShowCloseMonth(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your total income for this month in euros (€). Net savings (income − expenses) will be verified
              and used to calculate your Atlas European travel eligibility.
            </p>
            <p className="text-xs text-muted-foreground">
              Total expenses this month: <span className="font-mono-data font-bold text-foreground">{formatCurrency(totalSpent)}</span>
            </p>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Monthly income (€)"
                value={closeMonthIncome}
                onChange={(e) => setCloseMonthIncome(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCloseMonth} className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
                <CalendarCheck className="w-4 h-4" /> Confirm &amp; Close
              </Button>
            </div>
            {closeMonthIncome && parseFloat(closeMonthIncome) > 0 && (
              <p className="text-xs text-muted-foreground">
                Net savings: <span className="font-mono-data font-bold text-emerald-600">
                  {formatCurrency(parseFloat(closeMonthIncome) - totalSpent)}
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
                placeholder="Amount (€) e.g. 120"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 px-3 rounded-md border text-xs bg-background"
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
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No Expenses Yet</p>
              <p>Your financial activity will appear here as you log expenses in euros (€).</p>
            </div>
          ) : (
            expenses.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-teal-500/5 transition-colors group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{item.note || item.category}</span>
                    <Badge variant="outline" className="text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">{item.date}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-sm text-destructive block">
                    -{formatCurrency(parseFloat(item.amount) || 0)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(item.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
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
