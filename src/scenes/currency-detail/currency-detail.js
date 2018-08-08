import React from 'react';
import { Query } from 'regraph-request';
import { Text, View, StyleSheet, PixelRatio, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollContainer } from '../../components/container';
import { CLText } from '../../components/cl-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Chart } from './components/chart';
import { CurrencyInformationItem } from './components/currency-information-item';
import { MarketInfo } from './components/market-info';
import CryptoIcon from 'react-native-crypto-icons';
import { CLButton } from '../../components/button';

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
        this.props.navigation.getParam('quoteSymbol').toUpperCase()
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
      <ScrollContainer style={[style.container]}>
        <View style={[style.header]}>
          <CLButton>
            <Text style={{ color: 'white', marginRight: 5 }}>5M</Text>
            <FontAwesome name="caret-down" style={{ color: 'white' }} />
          </CLButton>
          <View style={[style.priceContainer]}>
            <View>
              <CLText style={style.price}>{price}</CLText>
            </View>
            <View style={[style.priceChangeContainer]}>
              <FontAwesome
                name={isPositive ? 'caret-up' : 'caret-down'}
                size={10}
                style={[isPositive ? style.positive : style.negative]}
              />
              <CLText style={[isPositive ? style.positive : style.negative, style.priceChange]}>
                {change.toString().substring(1)}%
              </CLText>
            </View>
          </View>
        </View>
        <View>
          <Chart
            currencySymbol={this.props.data.currency.currencySymbol}
            quoteSymbol={this.props.navigation.getParam('quoteSymbol')}
          />
        </View>
        <View
          style={{
            width: Dimensions.get('screen').width,
            flex: 1,
            flexDirection: 'row',
            marginTop: 20,
          }}
        >
          <CurrencyInformationItem name="Market Cap" value="$140,974,291,969" />
          <CurrencyInformationItem name="Current Supply" value="17,173,150" />
          <CurrencyInformationItem name="Total Supply" value="21,000,000" />
        </View>
        <View
          style={{
            width: Dimensions.get('screen').width,
            flex: 1,
            flexDirection: 'row',
            marginTop: 20,
          }}
        >
          <MarketInfo name="Volume / Exchange" />
          <MarketInfo name="Volume / Quote" />
        </View>
      </ScrollContainer>
    );
  }
}

export const CurrencyDetail = Query(CurrencyDetailComponent, CURRENCY_QUERY, props => ({
  currencySymbol: props.navigation.getParam('currencySymbol'),
}));

const TitleBar = ({ name, symbol }) => {
  return (
    <View style={style.title}>
      <CryptoIcon name={symbol.toLowerCase()} style={style.titleIcon} />
      <CLText style={style.titleText}>{name}</CLText>
    </View>
  );
};

CurrencyDetail.navigationOptions = ({ navigation }) => ({
  headerTitle: (
    <TitleBar
      symbol={navigation.getParam('currencySymbol')}
      name={navigation.getParam('currencyName')}
    />
  ),
});

const style = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 20,
    color: '#4a4a4a',
    marginRight: 10,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 20,
  },
  container: {
    marginLeft: 10,
    width: Dimensions.get('screen').width - 20,
    paddingTop: 10,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  price: {
    fontSize: 14,
  },
  priceChangeContainer: { flexDirection: 'row', alignItems: 'baseline' },
  priceChange: { fontSize: 10 },
  positive: { color: 'green' },
  negative: { color: 'red' },
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
