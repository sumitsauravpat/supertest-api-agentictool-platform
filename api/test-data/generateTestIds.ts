export function generateTestIds(): Record<string, string> {
  return {
    customerId: crypto.randomUUID(),
    billingAccountNumber: crypto.randomUUID(),
  };
}
