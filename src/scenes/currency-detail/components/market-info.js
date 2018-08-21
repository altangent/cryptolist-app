import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { CLText } from '../../../components/cl-text';
import { PieChart } from 'react-native-svg-charts';
import { Query } from 'regraph-request';

const MARKETS_QUERY = `
query MarketQuery($currencySymbol: String!) {
  currency(currencySymbol: $currencySymbol) {
    id
    markets {
      data {
        id
        marketSymbol
        ticker {
          last
          percentChange
          dayLow
          dayHigh
          baseVolume
          quoteVolume
        }
      }
    }
  }
}
`;

export class MarketInfoComponent extends React.Component {
  constructor(props) {
    super(props);

    this.getExchangeVolume = this.getExchangeVolume.bind(this);
    this.getQuoteVolume = this.getQuoteVolume.bind(this);
  }

  getExchangeVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const exchange = market.marketSymbol.split(':')[0];
      if (market.ticker) {
        aggregator[exchange] = aggregator[exchange] || 0 + market.ticker.baseVolume;
      }
      return aggregator;
    }, []);
  }

  getQuoteVolume(markets) {
    return markets.reduce((aggregator, market) => {
      const quote = market.marketSymbol.split('/')[1];
      if (market.ticker) {
        aggregator[quote] = aggregator[quote] || 0 + market.ticker.baseVolume;
      }
      return aggregator;
    }, []);
  }

  render() {
    if (!this.props.data.currency) {
      return null;
    }
    let quoteVolume = this.getQuoteVolume(this.props.data.currency.markets.data);
    let exchangeVolume = this.getExchangeVolume(this.props.data.currency.markets.data);

    const quoteData = Object.values(quoteVolume)
      .filter(value => value > 0)
      .map((value, index) => ({
        value,
        svg: {
          fill: ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7),
          onPress: () => console.log('press', index),
        },
        key: `pie-${index}`,
      }));

    const exchangeData = Object.values(exchangeVolume)
      .filter(value => value > 0)
      .map((value, index) => ({
        value,
        svg: {
          fill: ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7),
          onPress: () => console.log('press', index),
        },
        key: `pie-${index}`,
      }));

    return (
      <View
        style={{
          width: Dimensions.get('screen').width,
          flex: 1,
          flexDirection: 'row',
          marginTop: 20,
        }}
      >
        <View style={style.container}>
          <PieChart style={style.circle} padAngle={0} data={exchangeData} />;
          <CLText style={style.name}>Volume / Exchange</CLText>
        </View>
        <View style={style.container}>
          <PieChart style={style.circle} padAngle={0} data={quoteData} />;
          <CLText style={style.name}>Volume / Quote</CLText>
        </View>
      </View>
    );
  }
}

MarketInfoComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
};

export const MarketInfo = Query(MarketInfoComponent, MARKETS_QUERY, ({ currencySymbol }) => ({
  currencySymbol,
}));

const ITEMS_PER_ROW = 2;
const style = StyleSheet.create({
  container: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  circle: {
    width: (Dimensions.get('screen').width - 60) / ITEMS_PER_ROW,
    height: (Dimensions.get('screen').width - 60) / ITEMS_PER_ROW,
  },
  name: {
    flex: 1,
    fontSize: 11,
    marginTop: 20,
  },
});
