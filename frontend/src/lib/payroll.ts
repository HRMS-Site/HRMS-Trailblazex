export function calculateNetPay(grossPay: number | string | null | undefined, deductions: number | string | null | undefined): number {
  const gross = Number(grossPay ?? 0);
  const deductionValue = Number(deductions ?? 0);

  if (!Number.isFinite(gross) || !Number.isFinite(deductionValue)) {
    return 0;
  }

  return Math.max(0, gross - deductionValue);
}
