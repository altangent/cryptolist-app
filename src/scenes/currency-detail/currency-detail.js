import React from 'react';
import { Query } from 'regraph-request';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Container } from '../../components/container';

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
  }
}
`;

export class CurrencyDetailComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.data.currency) {
      return <ActivityIndicator />;
    }

    return (
      <Container>
        <ScrollView>
          <Text>{this.props.data.currency.currencyName}</Text>
        </ScrollView>
      </Container>
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
