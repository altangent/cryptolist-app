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
import { getQuotes } from '../../library/quote-currency-persister';
import { ResultListPaginator } from './components/result-list-paginator';

const DEFAULT_FILTER = '%';
const MAX_PER_PAGE = 20;
const CURRENCY_QUERY = `
query AllCurrencies ($filter:String, $favorites:[String], $favoritesPage:Page, $page:Page) {
  favorites: currencies(
    page: $favoritesPage,
    sort: { marketCapRank: ASC },
    filter: {
      _and: [
        { currencySymbol_in: $favorites },
        {
          _or: [
            { currencySymbol_like: $filter },
            { currencyName_like: $filter }
          ]
        }
      ]
    }
  ) {
    data {
      id
      currencyName
      currentSupply
      currencySymbol
      markets(aggregation: VWA) {
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
  currencies(
    page: $page,
    sort: { marketCapRank: ASC },
    filter: {
      _and: [
        { currencySymbol_nin: $favorites },
        {
          _or: [
            { currencySymbol_like: $filter },
            { currencyName_like: $filter }
          ]
        }
      ]
    }
  ) {
    totalCount
    data {
      id
      currencyName
      currentSupply
      currencySymbol
      markets(aggregation: VWA) {
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
  bitcoin: currency(currencySymbol: "BTC") {
    markets {
      marketSymbol
      ticker {
        last
        percentChange
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
    this.updateQuote = this.updateQuote.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.paginate = this.paginate.bind(this);

    this.updateQuote();
    this.willFocusSubscription = props.navigation.addListener('willFocus', this.updateQuote);

    this.state = {
      refreshing: false,
      searchVisibile: false,
      quoteSymbol: 'BTC',
      page: 1,
    };
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
  };

  updateQuote() {
    getQuotes().then(quotes => {
      this.setState({ quoteSymbol: quotes.primary, secondaryQuoteSymbol: quotes.secondary });
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleSearchVisibility: this.toggleSearchVisibility });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
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
      query = { filter: DEFAULT_FILTER };
    }
    this.props.getData({ filter: query });
  }

  paginate(page) {
    this.setState({ page });
    getFavorites().then(favoites => {
      let favoritesCount = favoites.length;
      let favoritesToRequest = Math.min(MAX_PER_PAGE - favoritesCount * page, favoritesCount);
      let favoritesSkip = MAX_PER_PAGE * (page - 1);
      let favoritesLimit = Math.max(favoritesToRequest - favoritesSkip, 0);
      let favoritesPage = {
        skip: favoritesSkip,
        limit: favoritesLimit,
      };

      let restLimit = page * MAX_PER_PAGE - favoritesSkip - favoritesLimit;
      let restSkip = Math.max((page - 1) * MAX_PER_PAGE - favoritesCount, 0);
      let restPage = {
        skip: restSkip,
        limit: restLimit,
      };

      this.props.getData({
        page: restPage,
        favoritesPage: favoritesPage,
      });
    });
  }

  goBack() {
    this.paginate(this.state.page - 1);
  }

  goForward() {
    this.paginate(this.state.page + 1);
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
          <CurrencyList
            {...this.props}
            quoteSymbol={this.state.quoteSymbol}
            secondaryQuoteSymbol={this.state.secondaryQuoteSymbol}
          />
          <ResultListPaginator
            onBackPress={this.goBack}
            onForwardPress={this.goForward}
            forwardDisabled={false}
            backDisabled={this.state.page <= 1}
          />
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
    let favoritesCount = this.state.favorites.length;
    let favoritesToRequest = Math.min(favoritesCount, MAX_PER_PAGE);
    return (
      this.state.favoritesLoaded && (
        <QueryComponent
          component={HomeComponent}
          query={CURRENCY_QUERY}
          variables={() => ({
            favorites: this.state.favorites.length ? this.state.favorites : ['FAKEFAKE'],
            filter: DEFAULT_FILTER,
            page: {
              skip: 0,
              limit: MAX_PER_PAGE - favoritesToRequest,
            },
            favoritesPage: {
              skip: 0,
              limit: favoritesToRequest,
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
