// Amounts are stored in minor units (e.g. cents). All surfaces share one
// formatter so totals render identically everywhere.
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amountInMinorUnits: number): string {
  return usdFormatter.format(amountInMinorUnits / 100);
}
