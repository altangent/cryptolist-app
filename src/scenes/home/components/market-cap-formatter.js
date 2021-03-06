const asCurrency = (value, quoteSymbol, precision) => {
  switch (quoteSymbol) {
    case 'USD':
      return '$' + value.toLocaleString();
    case 'GBP':
      return '£' + value.toLocaleString();
    case 'EUR':
      return '€' + value.toLocaleString();
    case 'USDT':
      return value.toLocaleString() + 'USDT';
    default:
      return value.toFixed(precision ? precision : 4) + quoteSymbol;
  }
};

const calculatePriceFromBtc = (priceInBtc, priceOfBtc) => {
  return priceInBtc * priceOfBtc;
};

const getPriceOfBtc = (btcNode, quoteSymbol) => {
  const btcMarket = btcNode.markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  return btcMarket ? btcMarket.ticker.last : 1;
};

const getPercentageChange = (markets, btcNode, quoteSymbol) => {
  if (!markets || !markets.length) return 0;

  // Try to use native market
  const market = markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (market && market.ticker) return market.ticker.percentChange.toFixed(2);

  // If native market does not exist, convert to btc
  const currencyBtcMarket = markets.find(market => market.marketSymbol.endsWith('BTC'));
  const btcQuoteMarket = btcNode.markets.find(market => market.marketSymbol.endsWith(quoteSymbol));
  if (currencyBtcMarket && btcQuoteMarket && currencyBtcMarket.ticker)
    return (btcQuoteMarket.ticker.percentChange + currencyBtcMarket.ticker.percentChange).toFixed(
      2
    );

  return 0;
};

const get24HourVolume = (market, btcMarket, priceOfBtc, quoteSymbol) => {
  if (market && market.ticker) return asCurrency(market.ticker.quoteVolume, quoteSymbol);

  if (btcMarket && btcMarket.ticker)
    return asCurrency(btcMarket.ticker.quoteVolume * priceOfBtc, quoteSymbol);
  else return asCurrency(0, quoteSymbol);
};

const getPrice = (markets, btcMarket, quoteSymbol) => {
  const hasMarkets = !!markets;
  const market = hasMarkets
    ? markets.find(market => market.marketSymbol.endsWith(quoteSymbol))
    : null;
  let lastPrice = hasMarkets && market && market.ticker ? market.ticker.last : 0;
  const priceInBtc = btcMarket && btcMarket.ticker ? btcMarket.ticker.last : 1;
  const priceOfBtc = getPriceOfBtc(btcMarket, quoteSymbol);
  if (lastPrice === 0 && hasMarkets) {
    lastPrice = calculatePriceFromBtc(priceInBtc, priceOfBtc);
  }
  return asCurrency(lastPrice, quoteSymbol, 8);
};

export const marketCapFormat = (currencies, btcNode, quoteSymbol, secondaryQuoteSymbol) => {
  if (!currencies.length) return [];
  quoteSymbol = quoteSymbol.toUpperCase();

  const priceOfBtc = getPriceOfBtc(btcNode, quoteSymbol);

  return currencies.map(currency => {
    const hasMarkets = !!currency.markets.length;
    const market = hasMarkets
      ? currency.markets.find(market => market.marketSymbol.endsWith(quoteSymbol))
      : null;
    const percentChange = getPercentageChange(currency.markets, btcNode, quoteSymbol);
    const btcMarket = currency.markets.find(market => market.marketSymbol.endsWith('BTC'));
    const volume = get24HourVolume(market, btcMarket, priceOfBtc, quoteSymbol);

    if (secondaryQuoteSymbol) {
      secondaryQuote = {
        percentChange: getPercentageChange(currency.markets, btcNode, secondaryQuoteSymbol),
        price: getPrice(currency.markets, btcNode, secondaryQuoteSymbol),
      };
    }

    return {
      id: currency.id,
      name: currency.currencyName,
      symbol: currency.currencySymbol,
      supply: currency.currentSupply.toLocaleString(),
      marketCap: asCurrency(calculatePriceFromBtc(currency.marketCap, priceOfBtc), quoteSymbol),
      marketCapRank: currency.marketCapRank,
      price: getPrice(currency.markets, btcNode, quoteSymbol),
      secondaryQuote,
      percentChange,
      volume,
    };
  });
};
