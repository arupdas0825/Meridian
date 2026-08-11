'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { Wallet, Plus, Trash2, ArrowDownLeft, DollarSign, Lock, CheckCircle } from 'lucide-react';
import { listCollection, createDoc, deleteDocById } from '@/shared/lib/firestore';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    const data = await listCollection('ledgerwise', 'expenses');
    if (data.length === 0) {
      // Seed default expenses
      const seeds = [
        { category: 'Rent & Utilities', amount: 18000, note: 'August Rent', date: '2026-08-01' },
        { category: 'Food & Dining', amount: 4500, note: 'Groceries & Dining', date: '2026-08-05' },
        { category: 'Transport', amount: 1200, note: 'Metro Pass', date: '2026-08-07' },
      ];
      for (const s of seeds) {
        await createDoc('ledgerwise', 'expenses', s);
      }
      const loaded = await listCollection('ledgerwise', 'expenses');
      setExpenses(loaded);
    } else {
      setExpenses(data);
    }
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }

    const newExpense = {
      category,
      amount: parsedAmount,
      note: note || category,
      date: new Date().toISOString().split('T')[0],
      yyyyMm: new Date().toISOString().slice(0, 7),
    };

    const created = await createDoc('ledgerwise', 'expenses', newExpense);
    setExpenses([created, ...expenses]);
    setAmount('');
    setNote('');
    toast.success(`Logged expense of ₹${parsedAmount.toLocaleString()}`);
  };

  const handleDeleteExpense = async (id) => {
    await deleteDocById('ledgerwise', 'expenses', id);
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-900 dark:text-teal-100 font-heading">
            LedgerWise — Expense Tracker
          </h1>
          <p className="text-xs text-muted-foreground">Rigorous personal finance and budget tracking</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-800 dark:text-teal-200">
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-medium">Total Month Expenses</span>
            <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">₹{totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Add Expense Card */}
      <Card className="border-teal-500/20 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 px-3 rounded-md border text-xs bg-background"
            >
              <option value="Food & Dining">Food & Dining</option>
              <option value="Rent & Utilities">Rent & Utilities</option>
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
            <div className="py-12 text-center text-xs text-muted-foreground">
              No Expenses — Your financial activity will appear here.
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
                  <span className="font-bold text-sm text-destructive">
                    -₹{parseFloat(item.amount).toLocaleString()}
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
