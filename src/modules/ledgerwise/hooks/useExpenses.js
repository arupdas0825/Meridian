'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';
import { recalculateVerifiedSavings } from '@/shared/services/travelEligibilityService';

/**
 * Live-reactive hook for LedgerWise expenses.
 */
export function useExpenses() {
  const expenses = useLiveQuery(() => db.lw_expenses.orderBy('createdAt').reverse().toArray(), []);
  return { expenses: expenses ?? [], loading: expenses === undefined };
}

/**
 * Live-reactive hook for monthly summaries.
 */
export function useMonthSummaries() {
  const summaries = useLiveQuery(() => db.lw_monthlySummaries.toArray(), []);
  return { summaries: summaries ?? [], loading: summaries === undefined };
}

export async function addExpense({ category, amount, note, date }) {
  const dateStr = date || new Date().toISOString().split('T')[0];
  return db.lw_expenses.add({
    category,
    amount,
    note: note || category,
    date: dateStr,
    month: dateStr.slice(0, 7),
    createdAt: new Date().toISOString(),
  });
}

export async function deleteExpense(id) {
  return db.lw_expenses.delete(id);
}

/**
 * Close a month: aggregate expenses, compute net savings, write summary,
 * then recalculate verified travel savings — the real cross-module link.
 *
 * This is the ONLY path that updates atlas_wallet.verifiedSavings.
 * Manual wallet edits never touch it (Rule 4).
 */
export async function closeMonth(yyyyMm, income) {
  const monthExpenses = await db.lw_expenses.where('month').equals(yyyyMm).toArray();
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netSavings = income - totalExpenses;

  await db.lw_monthlySummaries.put({
    yyyyMm,
    income,
    expenses: totalExpenses,
    netSavings,
    confirmed: true,
    closedAt: new Date().toISOString(),
  });

  // Recalculate and persist verified travel savings immediately
  const allSummaries = await db.lw_monthlySummaries.toArray();
  const verifiedSavings = recalculateVerifiedSavings(allSummaries);
  const wallet = (await db.atlas_wallet.get('main')) ?? { id: 'main', availableFunds: 0, verifiedSavings: 0 };
  await db.atlas_wallet.put({ ...wallet, verifiedSavings });
}
