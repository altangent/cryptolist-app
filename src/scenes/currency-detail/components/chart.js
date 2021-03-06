import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';
import { CLText } from '../../../components/cl-text';

const MARKET_QUERY = `
query Currency(
  $currencySymbol: String!,
  $resolution: CandleResolution!,
  $start: Int,
  $end: Int,
  $quoteSymbol: String
) {
  currency(currencySymbol: $currencySymbol) {
    id
    markets(aggregation: VWA, filter: {quoteSymbol_like: $quoteSymbol}) {
      marketSymbol
      ohlcv(resolution: $resolution, start: $start, end: $end, sort:OLD_FIRST)
    }
  }
}
`;

export class ChartComponent extends React.PureComponent {
  static propTypes = {
    currencySymbol: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
    start: PropTypes.number,
    end: PropTypes.number,
    resolution: PropTypes.object,
  };

  render() {
    let currency = this.props.data.currency;

    if (!currency) {
      return <ActivityIndicator />;
    }

    let markets = currency.markets;
    let market = markets[0];

    if (!market)
      return (
        <View>
          <CLText>No market found</CLText>
        </View>
      );

    const data = market.ohlcv.map(candle => candle[1]);
    const contentInset = { top: 20, bottom: 20 };

    return (
      <View style={{ height: 200, flexDirection: 'row' }}>
        <YAxis
          data={data}
          contentInset={contentInset}
          numberOfTicks={5}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={data}
          curve={shape.curveNatural}
          contentInset={contentInset}
          svg={{
            stroke: 'url(#gradient)',
          }}
        >
          <Grid />
          <Defs key={'gradient'}>
            <LinearGradient id={'gradient'} x1={'0'} x2={'0'} y1={'0'} y2={'100%'}>
              <Stop offset={'0%'} stopColor={'#23c5d5'} />
              <Stop offset={'100%'} stopColor={'#23d59b'} />
            </LinearGradient>
          </Defs>
        </LineChart>
      </View>
    );
  }
}

export const Chart = Query(ChartComponent, MARKET_QUERY, props => ({
  currencySymbol: props.currencySymbol,
  resolution: props.resolution.value,
  start: props.start,
  end: props.end,
  quoteSymbol: props.quoteSymbol,
}));
