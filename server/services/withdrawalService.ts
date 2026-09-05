export function calculateClearanceDate(
  lastDoseDate: string,
  withdrawalDays: number
): string {
  const date = new Date(lastDoseDate);

  date.setDate(date.getDate() + withdrawalDays);

  return date.toISOString().split('T')[0];
}

export function getWithdrawalStatus(
  clearanceDate: string
): {
  status: 'Active' | 'Cleared';
  daysLeft: number;
} {
  const today = new Date();
  const clearance = new Date(clearanceDate);

  today.setHours(0, 0, 0, 0);
  clearance.setHours(0, 0, 0, 0);

  const difference =
    clearance.getTime() - today.getTime();

  const daysLeft = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysLeft > 0) {
    return {
      status: 'Active',
      daysLeft,
    };
  }

  return {
    status: 'Cleared',
    daysLeft: 0,
  };
}