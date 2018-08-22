import React from 'react';
import { Query } from 'regraph-request';
import { View, StyleSheet, PixelRatio, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import CryptoIcon from 'react-native-crypto-icons';
import moment from 'moment';
import { ScrollContainer } from '../../components/container';
import { CLText } from '../../components/cl-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Chart } from './components/chart';
import { CurrencyInformationItem } from './components/currency-information-item';
import { MarketInfo } from './components/market-info';
import { Resolutions, ResolutionGroup, StartEndGroup } from './components/chart-tools';

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
  constructor(props) {
    super(props);

    this.changeResolution = this.changeResolution.bind(this);
    this.changeStartEnd = this.changeStartEnd.bind(this);

    this.state = {
      resolution: Resolutions.find(r => r.value === '_1h'),
      start: moment()
        .subtract(3, 'months')
        .unix(),
      end: moment().unix(),
    };
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  changeResolution(resolution) {
    this.setState({ resolution });
  }

  changeStartEnd(start, end) {
    this.setState({ start, end });
  }

  render() {
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
            resolution={this.state.resolution}
            start={this.state.start}
            end={this.state.end}
          />
          <View style={style.chartTools}>
            <ResolutionGroup resolution={this.state.resolution} onChange={this.changeResolution} />
            <StartEndGroup
              start={this.state.start}
              end={this.state.end}
              onChange={this.changeStartEnd}
            />
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get('screen').width,
            flex: 1,
            flexDirection: 'row',
            marginTop: 20,
          }}
        >
          <CurrencyInformationItem
            name="Market Cap"
            value={this.props.data.currency.marketCap.toLocaleString()}
          />
          <CurrencyInformationItem
            name="Current Supply"
            value={this.props.data.currency.currentSupply.toLocaleString()}
          />
          <CurrencyInformationItem
            name="Total Supply"
            value={this.props.data.currency.totalSupply.toLocaleString()}
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
          <MarketInfo
            currencySymbol={this.props.navigation.getParam('currencySymbol')}
            navigation={this.props.navigation}
          />
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
  chartTools: {
    flex: 1,
    flexDirection: 'column',
  },
  border: {
    borderWidth: 0.5 * PixelRatio.get(),
    borderColor: 'red',
  },
});
