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

export const currencyColor = currencySymbol => {
  switch (currencySymbol) {
    case 'USD':
      return '#74A321';
    case 'GBP':
      return '#C595D0';
    case 'EUR':
      return '#90BADB';
    case 'USDT':
      return '#609c7f';
    case 'BTC':
      return '#e19a4f';
    case 'QC':
      return '#5ECF96';
    case 'JPY':
      return '#FF62EA';
    case 'TUSD':
      return '#69FFE9';
    case 'EURS':
      return '#174E0A';
    case 'DAI':
      return '#F8E71C';
    case 'ETH':
      return '#68829e';
    case 'OKB':
      return '#96bcec';
    case 'BNB':
      return '#e6bc61';
    case 'ZB':
      return '#c64536';
    case 'HT':
      return '#1d213f';
  }
};
