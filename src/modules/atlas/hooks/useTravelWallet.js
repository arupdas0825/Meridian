'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';

/**
 * Live-reactive hook for the Atlas travel wallet.
 * Reads the single-row wallet doc (id: 'main').
 */
export function useTravelWallet() {
  const wallet = useLiveQuery(() => db.atlas_wallet.get('main'), []);
  return {
    availableFunds: wallet?.availableFunds ?? 0,
    verifiedSavings: wallet?.verifiedSavings ?? 0,
    loading: wallet === undefined,
  };
}

/**
 * Live-reactive hook for travel goals.
 */
export function useGoals() {
  const goals = useLiveQuery(() => db.atlas_goals.orderBy('createdAt').reverse().toArray(), []);
  return { goals: goals ?? [], loading: goals === undefined };
}

/**
 * Add funds to the wallet's availableFunds only.
 * This NEVER touches verifiedSavings (Rule 4).
 */
export async function addWalletFunds(amount, note = '') {
  const wallet = (await db.atlas_wallet.get('main')) ?? { id: 'main', availableFunds: 0, verifiedSavings: 0 };
  await db.atlas_wallet.put({ ...wallet, availableFunds: wallet.availableFunds + amount });
  await db.atlas_walletTx.add({
    type: 'add',
    amount,
    note,
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  });
}

export async function createGoal({ destinationId, city, country, flagEmoji, durationMonths, targetAmount }) {
  return db.atlas_goals.add({
    destinationId,
    city,
    country,
    flagEmoji,
    durationMonths,
    targetAmount,
    currentAmount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  });
}
