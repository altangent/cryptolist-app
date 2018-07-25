import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import { CLText } from '../../../components/cl-text';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';

export class CurrencyListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    currency: PropTypes.object,
    quoteSymbol: PropTypes.string,
  };

  render() {
    const { currency } = this.props;
    let positiveChange = currency.percentChange >= 0;

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onPress(currency.currencySymbol)}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.containerItem}>
              <CLText style={styles.subtitle}>{currency.symbol}</CLText>
              <CLText style={styles.title}>{currency.name}</CLText>
            </View>
            <View style={styles.containerItem}>
              <CLText style={styles.price}>{currency.price}</CLText>
              <CLText style={positiveChange ? styles.positiveChange : styles.negativeChange}>
                {currency.percentChange}
              </CLText>
            </View>
            <View style={styles.containerItem}>
              <MiniGraph
                width={70}
                height={30}
                isPositive={positiveChange}
                quote={this.props.quoteSymbol}
                currencyId={currency.symbol}
              />
            </View>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  title: { fontSize: 13 },
  subtitle: { fontSize: 10 },
  containerItem: { width: Dimensions.get('window').width / 3 },
  price: {
    paddingTop: 3,
    fontSize: 10,
  },
  positiveChange: {
    fontSize: 10,
    color: 'green',
  },
  negativeChange: {
    fontSize: 10,
    color: 'red',
  },
});
