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
import { CurrencyList } from './components/currency-list';
import { QueryComponent } from 'regraph-request';
import { SearchModal } from './components/search-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getFavorites } from '../../library/currency-favorite';

const CURRENCY_QUERY = `
query AllCurrencies ($filter:CurrencyFilter, $favorites:[String]) {
  favorites: currencies(
    page: { skip: 0, limit: 20 },
    sort: { marketCapRank: ASC },
    filter: {
      _and: [
        { currencySymbol_in: $favorites },
        $filter
      ]
    }
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
  currencies(
    page: { skip: 0, limit: 20 },
    sort: { marketCapRank: ASC },
    filter: {
      _and: [
        { currencySymbol_nin: $favorites },
        $filter
      ]
    }
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
    this.search = this.search.bind(this);

    this.state = {
      refreshing: false,
      searchVisibile: false,
      quoteSymbol: 'BTC',
    };
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.navigation.setParams({ toggleSearchVisibility: this.toggleSearchVisibility });
  }

  toggleSearchVisibility = () => {
    this.setState({ searchVisibile: !this.state.searchVisibile });
  };

  refresh() {
    this.setState({ refreshing: true });
    this.props.getData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  search(query) {
    if (query === null) {
      query = { filter: null };
    }
    this.props.getData(query);
  }

  render() {
    if (!this.props.data.currencies) {
      return <ActivityIndicator />;
    }

    let searchBar = this.state.searchVisibile ? <SearchModal onUpdate={this.search} /> : null;
    return (
      <View style={styles.containerView}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
          }
        >
          {searchBar}
          <CurrencyList {...this.props} quoteSymbol={this.state.quoteSymbol} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  quotePicker: {
    paddingTop: 10,
    paddingRight: 20,
  },
  logo: {
    width: Dimensions.get('window').width / 2,
    height: 50,
    resizeMode: Image.resizeMode.contain,
  },
  border: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export class Home extends React.Component {
  constructor(props) {
    super(props);
    getFavorites().then(favorites => {
      this.setState({ favoritesLoaded: true, favorites });
    });
    this.state = {
      favorites: [],
      favoritesLoaded: false,
    };
  }
  render() {
    return (
      this.state.favoritesLoaded && (
        <QueryComponent
          component={HomeComponent}
          query={CURRENCY_QUERY}
          variables={() => ({
            favorites: this.state.favorites.length ? this.state.favorites : ['FAKEFAKE'],
            filter: {
              _or: [{ currencySymbol_like: '%' }, { currencyName_like: '%' }],
            },
          })}
          {...this.props}
        />
      )
    );
  }
}

Home.navigationOptions = ({ navigation }) => ({
  headerTitle: <Image style={styles.logo} source={require('../../../img/cryptolist.png')} />,
  headerRight: (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <FontAwesome name="bars" size={20} style={{ paddingRight: 15 }} />
    </TouchableOpacity>
  ),
  headerLeft: (
    <TouchableOpacity onPress={navigation.getParam('toggleSearchVisibility')}>
      <FontAwesome name="search" size={20} style={{ paddingLeft: 15 }} />
    </TouchableOpacity>
  ),
});
