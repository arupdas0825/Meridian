// Static demo rates for v1 — clearly not live. Swap the fetch source later without touching call sites.
const EXCHANGE_RATES = {
  INR_TO_EUR: 0.0108, // pinned placeholder
  EUR_TO_INR: 92.5,
};

export function inrToEur(amountINR) {
  return Math.round(amountINR * EXCHANGE_RATES.INR_TO_EUR);
}

export function eurToInr(amountEUR) {
  return Math.round(amountEUR * EXCHANGE_RATES.EUR_TO_INR);
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatEUR(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}
