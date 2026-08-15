import Dexie from 'dexie';

export const db = new Dexie('MeridianDB');

db.version(1).stores({
  // TaskForge
  tf_tasks: '++id, title, status, priority, dueDate, createdAt',
  tf_projects: '++id, name, createdAt',
  // LedgerWise
  lw_expenses: '++id, category, amount, note, date, month, createdAt',
  lw_monthlySummaries: '&yyyyMm, income, expenses, netSavings, confirmed, closedAt',
  // Atlas
  atlas_wallet: '&id',                 // single row, id: 'main' — { availableFunds, verifiedSavings }
  atlas_walletTx: '++id, type, amount, note, date, createdAt',
  atlas_goals: '++id, destinationId, durationMonths, targetAmount, status, createdAt',
  atlas_tripExpenses: '++id, goalId, category, amount, date, createdAt',
  // Cross-cutting
  app_meta: '&key',                    // key/value: displayName, currencyPref, notificationsEnabled...
});

export default db;
