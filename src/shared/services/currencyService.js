// src/shared/services/currencyService.js

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount ?? 0);
}

// Used ONLY by the Currency Converter tool (Settings), never for main app display.
const CONVERTER_TARGETS = ['INR', 'USD', 'GBP'];

export async function getConverterRates() {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=EUR&to=${CONVERTER_TARGETS.join(',')}`);
    if (!res.ok) throw new Error('Rate fetch failed');
    const data = await res.json();
    return { rates: data.rates, asOf: data.date };
  } catch {
    return { rates: null, asOf: null, error: true };
  }
}
