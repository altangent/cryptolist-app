import React from 'react';
import { Query } from 'regraph-request';
import { View, StyleSheet, PixelRatio, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollContainer } from '../../components/container';
import { CLText } from '../../components/cl-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Chart } from './components/chart';
const CURRENCY_QUERY = `
query Currency($currencySymbol: String!) {
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
        ticker {
          last
          percentChange
        }
      }
    }
  }
}
`;

export class CurrencyDetailComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;
    let { currency } = this.props.data;
    if (!currency) {
      return <ActivityIndicator />;
    }

    let markets = currency.markets.data;
    let market = markets.find(market => {
      return market.marketSymbol.endsWith(
        this.props.navigation.state.params.quoteSymbol.toUpperCase()
      );
    });
    let price, change, isPositive;
    if (!market) {
      price = 0;
      change = 0;
      isPositive = true;
    } else {
      price = market.ticker.last;
      change = market.ticker.percentChange;
      isPositive = change >= 0;
    }

    return (
      <ScrollContainer style={style.container}>
        <View style={style.header}>
          <View style={[style.currencyNameContainer]}>
            <CLText style={style.currencyName}>{this.props.data.currency.currencyName}</CLText>
            <CLText style={style.currencySymbol}>
              ({this.props.data.currency.currencySymbol})
            </CLText>
          </View>
          <View style={[style.priceContainer]}>
            <View>
              <CLText>{price}</CLText>
            </View>
            <View style={[style.priceChange]}>
              <FontAwesome
                name={isPositive ? 'caret-up' : 'caret-down'}
                size={20}
                style={[{ paddingTop: 10 }, isPositive ? style.positive : style.negative]}
              />
              <CLText style={isPositive ? style.positive : style.negative}>{change}%</CLText>
            </View>
          </View>
        </View>
        <View>
          <Chart
            currencySymbol={this.props.data.currency.currencySymbol}
            quoteSymbol={this.props.navigation.state.params.quoteSymbol}
          />
        </View>
      </ScrollContainer>
    );
  }
}

export const CurrencyDetail = Query(
  CurrencyDetailComponent,
  CURRENCY_QUERY,
  props => ({
    currencySymbol: props.navigation.state.params.currencySymbol,
  }),
  'https://alpha.blocktap.io/graphql'
);

const style = StyleSheet.create({
  container: {
    paddingLeft: 10,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  currencyNameContainer: { flex: 3, flexDirection: 'row', alignItems: 'baseline' },
  priceContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  priceChange: { flexDirection: 'row', alignItems: 'baseline' },
  positive: { color: 'green' },
  negative: { color: 'red' },
  currencyName: {
    fontSize: 20,
  },
  currencySymbol: {
    color: 'grey',
    fontSize: 10,
    marginLeft: 5,
  },
  border: {
    borderWidth: 0.5 * PixelRatio.get(),
    borderColor: 'red',
  },
});
