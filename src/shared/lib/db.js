import Dexie from 'dexie';

export const db = new Dexie('MeridianDB');

db.version(1).stores({
  // LedgerWise offline expense queue
  lw_expenses: '++id, entryId, category, amount, date, month, synced',
  lw_budgetCache: 'yyyyMm, data, updatedAt',
  // Atlas offline wallet/expense queue
  atlas_walletTx: '++id, type, amount, note, date, synced',
  atlas_tripExpenses: '++id, goalId, category, amount, date, synced',
});

export default db;
