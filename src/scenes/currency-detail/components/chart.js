import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';

const MARKET_QUERY = `query Currency($currencySymbol: String!) {
  currency(currencySymbol: $currencySymbol) {
    id
    currencyName
    currentSupply
    totalSupply
    currencySymbol
    marketCap
    marketCapRank
    markets(aggregation: VWAP) {
      data {
        marketSymbol
        openedOn
        openedOnDate
        candles(resolution: _1m) {
          data
        }
      }
    }
  }
}
`;

export class ChartComponent extends React.PureComponent {
  static propTypes = {
    currencySymbol: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
  };

  render() {
    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0'} x2={'0'} y1={'0'} y2={'100%'}>
          <Stop offset={'0%'} stopColor={'#23c5d5'} />
          <Stop offset={'100%'} stopColor={'#23d59b'} />
        </LinearGradient>
      </Defs>
    );

    let currency = this.props.data.currency;

    if (!currency) {
      return <ActivityIndicator />;
    }

    let markets = currency.markets.data;
    let market = markets.find(market => {
      return market.marketSymbol.endsWith(this.props.quoteSymbol.toUpperCase());
    });

    if (!market)
      return (
        <View>
          <Text>No market found</Text>
        </View>
      );
    const data = market.candles.data.map(candle => candle[1]);
    const contentInset = { top: 20, bottom: 20 };

    return (
      <View style={{ height: 200, flexDirection: 'row' }}>
        <YAxis
          data={data}
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={5}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={data}
          curve={shape.curveNatural}
          svg={{
            stroke: 'url(#gradient)',
          }}
          contentInset={contentInset}
        >
          <Grid />
          <Gradient />
        </LineChart>
      </View>
    );
  }
}

export const Chart = Query(
  ChartComponent,
  MARKET_QUERY,
  props => ({ currencySymbol: props.currencySymbol }),
  'https://alpha.blocktap.io/graphql'
);
