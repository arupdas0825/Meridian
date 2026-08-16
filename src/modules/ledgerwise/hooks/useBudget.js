'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';

const currentMonth = () => new Date().toISOString().slice(0, 7); // e.g. "2026-08"

export function useMonthlyBudget() {
  const yyyyMm = currentMonth();
  const budget = useLiveQuery(async () => {
    try {
      if (!db.lw_budgets) return null;
      const row = await db.lw_budgets.get(yyyyMm);
      return row ?? null;
    } catch (err) {
      console.warn('Error fetching monthly budget:', err);
      return null;
    }
  }, [yyyyMm]);

  const expenses = useLiveQuery(async () => {
    try {
      if (!db.lw_expenses) return [];
      return await db.lw_expenses.where('month').equals(yyyyMm).toArray();
    } catch (err) {
      console.warn('Error fetching monthly expenses:', err);
      return [];
    }
  }, [yyyyMm]) ?? [];

  const spent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const remaining = budget ? budget.totalBudget - spent : null;

  return {
    yyyyMm,
    budget,
    spent,
    remaining,
    loading: false,
  };
}

export async function setMonthlyBudget(yyyyMm, totalBudget) {
  await db.lw_budgets.put({
    yyyyMm,
    totalBudget: Number(totalBudget),
    setAt: new Date().toISOString(),
  });
}
