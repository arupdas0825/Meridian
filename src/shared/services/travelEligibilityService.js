/**
 * Two numbers, never conflated:
 * - availableTravelFunds: freely editable wallet balance
 * - verifiedTravelSavings: derived ONLY from confirmed LedgerWise data, drives unlocks
 */

export function checkTravelEligibility(verifiedSavings, requiredSavings) {
  const unlocked = verifiedSavings >= requiredSavings;
  const remaining = Math.max(0, requiredSavings - verifiedSavings);
  const percentage = requiredSavings > 0
    ? Math.min(100, Math.round((verifiedSavings / requiredSavings) * 100))
    : 100;
  return { unlocked, remaining, percentage };
}

/**
 * Recalculates verifiedTravelSavings from CLOSED LedgerWise monthly summaries only.
 * closedMonthlySummaries: array of { yyyyMm, netSavings, confirmed: true }
 * Manual wallet edits must never be passed into this function.
 */
export function recalculateVerifiedSavings(closedMonthlySummaries = []) {
  return closedMonthlySummaries
    .filter((m) => m.confirmed)
    .reduce((sum, m) => sum + Math.max(0, m.netSavings), 0);
}

export function getDestinationStatus(destination, durationMonths, verifiedSavings) {
  const required = destination.minimumSavingsINR;
  const eligibility = checkTravelEligibility(verifiedSavings, required);
  return {
    ...eligibility,
    budget: durationMonths === 1
      ? destination.budgetByDuration.oneMonth
      : durationMonths === 3
        ? destination.budgetByDuration.threeMonth
        : destination.budgetByDuration.sixMonth,
  };
}
