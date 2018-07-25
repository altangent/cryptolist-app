import React from 'react';
import Svg, { LinearGradient, Path, Defs, Stop } from 'react-native-svg';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Query } from 'regraph-request';

const numberOfDays = 1;
const CURRENCY_QUERY = `
  query CurrencyQuery(
    $symbol: String
    $quoteSymbol: String
    $start: Int
    $end: Int
    $resolution: CandleResolution!
  ) {
    currency(currencySymbol: $symbol) {
      id
      markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          candles(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
            data
          }
        }
      }
      btcMarket: markets(filter: { quoteSymbol_eq: "BTC" }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          candles(start: $start, end: $end, resolution: $resolution, sort: OLD_FIRST) {
            data
          }
        }
      }
    }
    btcPrice: currency(currencySymbol: "BTC") {
      id
      markets(filter: { quoteSymbol_eq: $quoteSymbol }, aggregation: VWAP) {
        data {
          id
          marketSymbol
          ticker {
            last
          }
        }
      }
    }
  }
`;

export const MiniGraphComponent = ({ data, width, height, isPositive }) => {
  if (!data.currency || !data.currency.markets || !data.currency.btcMarket) return null;
  let prices;
  let currency = data.currency;
  let marketsData = currency.markets.data;
  let btcMarketData = currency.btcMarket.data;

  if (!marketsData.length) {
    if (btcMarketData.length && btcMarketData[0].candles) {
      let quotePrice = data.btcPrice.markets.data[0].ticker.last;
      prices = btcMarketData[0].candles.data.map(candle => {
        return candle[1] * quotePrice;
      });
    } else return null;
  } else {
    if (marketsData[0].candles) {
      prices = marketsData[0].candles.data.map(x => x[1]);
    } else return null;
  }

  let high = Math.max(...prices);
  let low = Math.min(...prices);
  let denominator = high - low;
  let actualPoints = prices.map((price, index) => ({
    x: (index / (24 * numberOfDays)) * width,
    y: height - ((price - low) / denominator) * height,
  }));
  if (!actualPoints.length) return null;
  let paths = actualPoints.map(price => `L${price.x},${price.y}`);
  let startingPosition = `M0,${height}`;
  let path = `${startingPosition}${paths.join('')}L${width},${
    actualPoints[actualPoints.length - 1].y
  }L${width},${height}`;
  let fill = `${path}z`;

  return (
    <Svg className="mini-graph" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <Path d={path} stroke={isPositive ? 'green' : 'orange'} />
      <Path d={fill} fill={isPositive ? '#c5e4b8' : '#f7d994'} />
    </Svg>
  );
};

MiniGraphComponent.propTypes = {
  currencyId: PropTypes.string,
  quote: PropTypes.string,
  data: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  isPositive: PropTypes.bool,
};

export const MiniGraph = Query(
  MiniGraphComponent,
  CURRENCY_QUERY,
  props => ({
    symbol: props.currencyId,
    quoteSymbol: props.quote,
    start: moment()
      .subtract(numberOfDays, 'day')
      .utc()
      .unix(),
    end: moment()
      .utc()
      .unix(),
    resolution: '_1h',
  }),
  'https://alpha.blocktap.io/graphql'
);