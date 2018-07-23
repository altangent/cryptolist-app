import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Text, PixelRatio } from 'react-native';
import { CLText } from '../../../components/cl-text';
import PropTypes from 'prop-types';

export class CurrencyListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    currency: PropTypes.object,
  };

  render() {
    const { currency } = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onPress(currency.currencySymbol)}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <CLText style={styles.subTitle}>{currency.currencySymbol}</CLText>
            <CLText style={styles.title}>{currency.currencyName}</CLText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  innerContainer: {
    // borderBottomWidth: 1 / PixelRatio.get(),
    // borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  title: { fontSize: 20 },
  subtitle: { fontSize: 10 },
});
