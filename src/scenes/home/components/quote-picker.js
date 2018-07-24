import React from 'react';
import {
  Picker,
  View,
  Modal,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Container } from '../../../components/container';
const quotes = ['USD', 'USDT', 'EUR', 'GBP', 'BTC'];

export class QuotePicker extends React.Component {
  constructor(props) {
    super(props);
    this.selectQuote = this.selectQuote.bind(this);
    this.state = {
      modalVisible: false,
      quoteSymbol: props.quoteSymbol,
    };
  }
  static propTypes = {
    style: PropTypes.number,
    onSelect: PropTypes.func,
    quoteSymbol: PropTypes.string,
  };

  selectQuote() {
    this.props.onSelect(this.state.quoteSymbol);
    this.setModalVisible(false);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={this.props.style}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <View style={styles.modal}>
            <Button
              onPress={() => {
                this.selectQuote();
              }}
              title="Done"
            />
            <View style={styles.footer}>
              <Picker
                selectedValue={this.state.quoteSymbol}
                onValueChange={value => this.setState({ quoteSymbol: value })}
              >
                {quotes.map(item => <Picker.Item label={item} value={item} key={item} />)}
              </Picker>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.buttonStyle}>{this.props.quoteSymbol}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let dimensions = Dimensions.get('window');
const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    top: dimensions.height - 220,
    width: dimensions.width,
  },
  footer: {
    height: 200,
    left: 0,
    width: dimensions.width,
  },
  buttonStyle: {
    // fontWeight: 'bold',
    top: 5,
    fontSize: 20,
    color: 'black',
  },
});
