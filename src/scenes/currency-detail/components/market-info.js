import React from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { CLText } from '../../../components/cl-text';
import { PieChart } from 'react-native-svg-charts';
import { Query } from 'regraph-request';

const MARKETS_QUERY = `
query Exchanges ($currencySymbol: String) {
  exchanges {
    data {
      id
      exchangeName
      exchangeSymbol
      primaryColor
      secondaryColor
      markets(filter: { baseSymbol_like: $currencySymbol }) {
        data {
          marketSymbol
          ticker {
            baseVolume
            quoteVolume
          }
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
    this._renderListItem = this._renderListItem.bind(this);
  }

  getExchangeVolume(exchange) {
    if (exchange.markets && exchange.markets.data) {
      let volume = exchange.markets.data.reduce((aggregator, market) => {
        return aggregator + market.ticker.baseVolume;
      }, 0);

      return {
        name: exchange.exchangeName,
        volume,
        color: exchange.primaryColor,
        key: exchange.id,
      };
    }
  }

  getExchangesVolume(exchanges) {
    let exchangeVolume = exchanges
      .map(e => this.getExchangeVolume(e))
      .sort((a, b) => (a.volume > b.volume ? -1 : 1));

    let totalVolume = exchangeVolume.reduce((reducer, item) => {
      return reducer + item.volume;
    }, 0);

    exchangeVolume.map(item => (item.percent = item.volume / totalVolume));
    return exchangeVolume;
  }

  getQuoteVolume(exchanges) {
    return exchanges
      .map(exchange =>
        exchange.markets.data.map(market => {
          let [exchange, pair] = market.marketSymbol.split(':');
          let [, quote] = pair.split('/');
          return {
            exchange,
            quote,
            volume: market.ticker.baseVolume,
          };
        })
      )
      .reduce((reducer, exchange) => {
        exchange.map(market => {
          let quote = market.quote;
          if (reducer[quote]) reducer[quote] += market.volume;
          else reducer[quote] = market.volume;
        });
        return reducer;
      }, {});
  }

  _renderListItem({ name, volume, percent, key, color }) {
    return (
      <View key={key} style={[style.row, style.exchangeContainer]}>
        <View
          style={[
            style.exchangeColor,
            {
              backgroundColor: color,
            },
          ]}
        />
        <View style={style.column}>
          <CLText style={{ paddingLeft: 10 }}>{name}</CLText>
          <View style={[style.row, style.exchangeDetailInfo]}>
            <CLText style={style.exchangeDetailInfoText}>
              {volume.toFixed(2)}
              {this.props.currencySymbol}
            </CLText>
            <CLText style={[style.exchangeDetailInfoText]}>{(percent * 100).toFixed(2)}%</CLText>
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (!this.props.data.exchanges) {
      return null;
    }

    let exchangeVolume = this.getExchangesVolume(this.props.data.exchanges.data);
    const exchangeData = exchangeVolume.map(value => ({
      value: value.volume,
      svg: {
        fill: value.color,
      },
      key: `exchange-${value.name}`,
    }));
    exchangeVolume = exchangeVolume.slice(0, 4);

    let quoteVolume = this.getQuoteVolume(this.props.data.exchanges.data);
    let quoteData = Object.keys(quoteVolume).map(value => ({
      value: quoteVolume[value],
      key: `quote-${value}`,
      svg: {
        fill: '#' + (((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 6),
      },
    }));
    let totalQuoteVolume = Object.values(quoteVolume).reduce(
      (reducer, current) => reducer + current,
      0
    );
    let quoteVolumeWithPercentages = Object.keys(quoteVolume)
      .map(value => ({
        name: value,
        volume: quoteVolume[value],
        percent: quoteVolume[value] / totalQuoteVolume,
        key: value,
        color: '#' + (((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 6), // Random color
      }))
      .sort((a, b) => (a.volume > b.volume ? -1 : 1))
      .slice(0, 4);

    return (
      <View style={style.container}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('ExchangeVolume')}>
          <View style={style.marketInfoContainer}>
            <CLText style={style.name}>Volume / Exchange</CLText>
            <View style={style.pieChartContainer}>
              <View style={style.flatListContainer}>
                {exchangeVolume.map(this._renderListItem)}
              </View>
              <View style={style.pieContainer}>
                <PieChart style={style.circle} padAngle={0} data={exchangeData} />;
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('QuoteVolume')}>
          <View style={style.marketInfoContainer}>
            <CLText style={style.name}>Volume / Quote</CLText>
            <View style={style.pieChartContainer}>
              <View style={style.pieContainer}>
                <PieChart style={style.circle} padAngle={0} data={quoteData} />;
              </View>
              <View style={style.flatListContainer}>
                {quoteVolumeWithPercentages.map(this._renderListItem)}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

MarketInfoComponent.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  navigation: PropTypes.object,
};

export const MarketInfo = Query(MarketInfoComponent, MARKETS_QUERY, ({ currencySymbol }) => ({
  currencySymbol,
}));

const ITEMS_PER_ROW = 2;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const style = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  border: {
    borderColor: 'red',
    borderWidth: 1,
  },
  pieContainer: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  circle: {
    width: (SCREEN_WIDTH - 60) / ITEMS_PER_ROW,
    height: (SCREEN_WIDTH - 60) / ITEMS_PER_ROW,
  },
  name: {
    fontSize: 14,
  },
  flatListContainer: {
    width: (SCREEN_WIDTH - 30) / ITEMS_PER_ROW,
    flex: 1,
    marginLeft: 10,
  },
  pieChartContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
  },
  marketInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    borderColor: '#cccccc',
    borderTopWidth: 1,
    marginTop: 10,
    width: SCREEN_WIDTH - 20,
  },
  exchangeColor: {
    width: 20,
    height: 20,
    paddingRight: 10,
    paddingLeft: 10,
  },
  exchangeContainer: {
    paddingRight: 10,
    paddingTop: 10,
  },
  exchangeDetailInfoText: {
    paddingLeft: 10,
    fontSize: 10,
    color: '#9B9B9B',
  },
  exchangeDetailInfo: {
    justifyContent: 'space-between',
  },
});
