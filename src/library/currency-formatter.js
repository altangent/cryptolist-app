export const formatCurrency = (amount, currency) => {
  switch (currency) {
    case 'USD':
      return '$' + amount.toLocaleString();
    case 'GBP':
      return '£' + amount.toLocaleString();
    case 'EUR':
      return '€' + amount.toLocaleString();
    case 'USDT':
      return amount.toLocaleString() + 'USDT';
    default:
      return amount.toLocaleString() + currency;
  }
};
