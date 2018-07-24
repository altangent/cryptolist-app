import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './currency-list-item';
import { marketCapFormat } from './market-cap-formatter';

export class CurrencyList extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;

    let currencies = marketCapFormat(
      this.props.data.currencies.data,
      this.props.data.bitcoin,
      'USD'
    );

    let items = currencies.map(item => {
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
