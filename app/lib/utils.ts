export const TARGETS = ["AUD", "USD", "EUR", "GBP", "JPY", "NZD"];

export function convertAudToTarget(amount: number, target: string, rates: Record<string, number>) {
  const rAud = rates["AUD"];
  const rTarget = rates[target];
  if (!rAud || !rTarget) return null;
  return amount * (rTarget / rAud);
}

export function formatMoney(value: number | null, currency: string) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}
