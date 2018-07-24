import React from 'react';
import { Query } from 'regraph-request';
import { Picker, View } from 'react-native';
import PropTypes from 'prop-types';
import { CurrencyListItem } from './currency-list-item';
import { marketCapFormat } from './market-cap-formatter';
const quotes = ['USD', 'USDT', 'EUR', 'GBP', 'BTC'];

export class QuotePicker extends React.Component {
  static propTypes = {};

  render() {
    return (
      <View>
        <Picker>
          <Picker.Item label="1" />
          <Picker.Item label="2" />
          <Picker.Item label="3" />
        </Picker>
      </View>
    );
  }
}
