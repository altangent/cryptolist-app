import React from 'react';
import { Query } from 'regraph-request';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

export class CurrencyListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    currency: PropTypes.object,
  };

  render() {
    const { currency } = this.props;

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => this.props.onPress(currency.currencySymbol)}>
          <View>
            <Text>{currency.currencyName}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
