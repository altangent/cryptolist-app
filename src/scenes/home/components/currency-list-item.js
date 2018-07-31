import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { CLText } from '../../../components/cl-text';
import PropTypes from 'prop-types';
import { MiniGraph } from './mini-graph';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as FavoriteUtils from '../../../library/currency-favorite';

export class CurrencyListItem extends React.Component {
  constructor(props) {
    super(props);

    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.updateFavorite = this.updateFavorite.bind(this);
    this.state = {
      isFavorite: false,
    };
  }

  componentDidMount() {
    this.updateFavorite();
  }

  updateFavorite() {
    FavoriteUtils.isFavorite(this.props.currency.symbol).then(isFavorite => {
      this.setState({ isFavorite });
    });
  }

  addFavorite() {
    FavoriteUtils.addFavorite(this.props.currency.symbol).then(() => {
      this.updateFavorite();
    });
  }

  removeFavorite() {
    FavoriteUtils.removeFavorite(this.props.currency.symbol).then(() => {
      this.updateFavorite();
    });
  }

  static propTypes = {
    onPress: PropTypes.func,
    currency: PropTypes.object,
    quoteSymbol: PropTypes.string.isRequired,
  };

  render() {
    const { currency } = this.props;
    let positiveChange = currency.percentChange >= 0;

    return (
      <TouchableWithoutFeedback onPress={() => this.props.onPress(currency.currencySymbol)}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.containerItemSm}>
              {this.state.isFavorite ? (
                <FontAwesome
                  name="star"
                  onPress={this.removeFavorite}
                  style={{ color: '#F8E71C' }}
                  size={20}
                />
              ) : (
                <FontAwesome
                  name="star"
                  onPress={this.addFavorite}
                  style={{ color: '#4a4a4a' }}
                  size={20}
                />
              )}
            </View>
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
  containerItem: { flex: 2 },
  containerItemSm: { flex: 1 },
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
