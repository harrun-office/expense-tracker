export const formatCurrency = (value, currency = 'INR') =>
  Number(value || 0).toLocaleString(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });

