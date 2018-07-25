import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Container } from '../../components/container';
import { CurrencyList } from './components/currency-list';
import { Query } from 'regraph-request';
import { QuotePicker } from './components/quote-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SearchModal } from './components/search-modal';

const CURRENCY_QUERY = `
query AllCurrencies ($filter:CurrencyFilter) {
  currencies(
    page: { skip: 0, limit: 20 },
    sort: { marketCapRank: ASC },
    filter: $filter
  ) {
    data {
      id
      currencyName
      currentSupply
      currencySymbol
      markets(aggregation: VWAP) {
        data {
          id
          marketSymbol
          ticker {
            last
            percentChange
            baseVolume
            quoteVolume
          }
        }
      }
    }
  }
  bitcoin: currency(currencySymbol: "BTC") {
    markets {
      data {
        marketSymbol
        ticker {
          last
        }
      }
    }
  }
}
`;

export class HomeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    this.setState({ refreshing: true });
    this.props.getData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
  };

  state = {
    refreshing: false,
    quoteSymbol: 'BTC',
  };

  render() {
    if (!this.props.data.currencies) {
      return <ActivityIndicator />;
    }
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
          }
        >
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../../../img/cryptolist.png')} />
            <SearchModal
              onUpdate={value => {
                console.log(value);
                this.props.getData(value);
              }}
            />
            <QuotePicker
              style={styles.quotePicker}
              onSelect={quoteSymbol => this.setState({ quoteSymbol })}
              quoteSymbol={this.state.quoteSymbol}
            />
          </View>
          <CurrencyList {...this.props} quoteSymbol={this.state.quoteSymbol} />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotePicker: {
    paddingTop: 10,
    paddingRight: 20,
  },
  logo: {
    width: Dimensions.get('window').width / 2,
    height: 50,
    resizeMode: Image.resizeMode.contain,
  },
});

export const Home = Query(
  HomeComponent,
  CURRENCY_QUERY,
  () => ({
    filter: null,
  }),
  'https://alpha.blocktap.io/graphql'
);
