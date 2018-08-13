import React from 'react';
import { TouchableHighlight, FlatList, View, StyleSheet, Text, PixelRatio } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { getQuotes, saveQuotes } from '../../library/quote-currency-persister';
import { CLText } from '../../components/cl-text';

const quotes = [
  { key: 'USD', name: 'United States dollar' },
  { key: 'USDT', name: 'Tether' },
  { key: 'EUR', name: 'Euro' },
  { key: 'GBP', name: 'Pound sterling' },
  { key: 'BTC', name: 'Bitcoin' },
];

export class QuotePicker extends React.Component {
  constructor(props) {
    super(props);

    console.log(
      '123',
      getQuotes().then(quotes => {
        let selected = quotes[props.navigation.getParam('name').toLowerCase()];
        console.log(selected);
        this.setState({ selected, quotes });
      })
    );
    this.select = this.select.bind(this);
  }

  state = {
    selected: '',
    quotes: {},
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    name: PropTypes.string,
  };

  select(selected) {
    console.log(selected);
    let quotes = this.state.quotes;
    quotes[this.props.navigation.getParam('name').toLowerCase()] = selected;
    saveQuotes(quotes).then(() => {
      this.setState({ selected });
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={quotes}
          extraData={this.state}
          renderItem={({ item }) => (
            <QuotePickerItem
              name={item.name}
              symbol={item.key}
              isSelected={this.state.selected === item.key}
              onPress={name => this.select(name)}
            />
          )}
        />
        <CLText>{this.state.selected}</CLText>
      </View>
    );
  }
}

QuotePicker.navigationOptions = ({ navigation }) => ({
  headerTitle: <CLText>{navigation.getParam('name')} Quote Currency</CLText>,
});

export class QuotePickerItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
  };

  render() {
    return (
      <TouchableHighlight onPress={() => this.props.onPress(this.props.symbol)}>
        <View style={[styles.quoteItem, styles.item]}>
          {this.props.isSelected ? <FontAwesome name="check" style={styles.itemIcon} /> : null}
          <CLText style={styles.itemText}>
            {this.props.name} ({this.props.symbol})
          </CLText>
        </View>
      </TouchableHighlight>
    );
  }
}

export class QuotePickerSettingsItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  render() {
    return (
      <TouchableHighlight onPress={() => this.props.onPress(this.props.name)}>
        <CLText style={[styles.item, styles.itemText]}>{this.props.name} quote currency</CLText>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  quoteItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    paddingRight: 5,
    color: '#ccc',
  },
  item: {
    padding: 10,
    height: 44,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  itemText: {
    fontSize: 18,
  },
});
