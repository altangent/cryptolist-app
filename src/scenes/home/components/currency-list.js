import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './currency-list-item';
import { marketCapFormat } from './market-cap-formatter';

export class CurrencyList extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
  };

  render() {
    console.log(this.props);
    const { navigate } = this.props.navigation;
    let currencies = marketCapFormat(
      this.props.data.currencies.data,
      this.props.data.bitcoin,
      this.props.quoteSymbol,
      this.props.secondaryQuoteSymbol
    );
    let favorites = marketCapFormat(
      this.props.data.favorites.data,
      this.props.data.bitcoin,
      this.props.quoteSymbol,
      this.props.secondaryQuoteSymbol
    );

    let favoriteItems = favorites.map(item => (
      <CurrencyListItem
        key={item.id}
        currency={item}
        quoteSymbol={this.props.quoteSymbol}
        onPress={() => {
          navigate('Detail', {
            currencySymbol: item.symbol,
            quoteSymbol: this.props.quoteSymbol,
            secondaryQuoteSymbol: this.props.secondaryQuoteSymbol,
            currencyName: item.name,
          });
        }}
      />
    ));
    let items = currencies.map(item => (
      <CurrencyListItem
        key={item.id}
        currency={item}
        quoteSymbol={this.props.quoteSymbol}
        onPress={() => {
          navigate('Detail', {
            currencySymbol: item.symbol,
            quoteSymbol: this.props.quoteSymbol,
            secondaryQuoteSymbol: this.props.secondaryQuoteSymbol,
            currencyName: item.name,
          });
        }}
      />
    ));
    return (
      <View>
        <View>{favoriteItems}</View>
        <View>{items}</View>
      </View>
    );
  }
}
