import React from 'react';
import { Query } from 'regraph-request';
import { ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './components/currency-list-item';
import { Container } from '../../components/container';

const CURRENCY_QUERY = `
query AllCurrencies {
  currencies(page: {skip: 0, limit: 10}, sort:{marketCapRank:ASC}) {
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

export class CryptoListComponent extends React.Component {
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
    return (
      <Container>
        <ScrollView>{items}</ScrollView>
      </Container>
    );
  }
}

export const CryptoList = Query(CryptoListComponent, CURRENCY_QUERY);
