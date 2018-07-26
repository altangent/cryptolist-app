import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './currency-list-item';
import { marketCapFormat } from './market-cap-formatter';

export class CurrencyList extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;

    let currencies = marketCapFormat(
      this.props.data.currencies.data,
      this.props.data.bitcoin,
      this.props.quoteSymbol
    );

    let items = currencies.map(item => (
      <CurrencyListItem
        key={item.id}
        currency={item}
        quoteSymbol={this.props.quoteSymbol}
        onPress={() => {
          navigate('Detail', { currencySymbol: item.symbol, quoteSymbol: this.props.quoteSymbol });
        }}
      />
    ));
    return <View>{items}</View>;
  }
}
