import React from 'react';
import { Query } from 'regraph-request';
import { ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './currency-list-item';

const CURRENCY_QUERY = `
query AllCurrencies {
  currencies(page: {skip: 0, limit: 20}, sort:{marketCapRank:ASC}) {
    totalCount
    data {
      id
      currencyName
      currentSupply
      totalSupply
      currencySymbol
      marketCap
      marketCapRank
    }
  }
}
`;

export class CurrencyListComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.data.currencies) {
      return <ActivityIndicator />;
    }

    let items = this.props.data.currencies.data.map(item => {
      return (
        <CurrencyListItem
          key={item.id}
          currency={item}
          onPress={() => {
            navigate('Detail', { currencySymbol: item.currencySymbol });
          }}
        />
      );
    });
    return <View>{items}</View>;
  }
}

export const CurrencyList = Query(
  CurrencyListComponent,
  CURRENCY_QUERY,
  () => {},
  'https://alpha.blocktap.io/graphql'
);
