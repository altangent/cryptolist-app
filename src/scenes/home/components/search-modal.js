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
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Container } from '../../../components/container';

export class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      searchText: '',
    };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  static propTypes = {
    onUpdate: PropTypes.func,
  };

  changeSearch() {
    this.setModalVisible(false);
    this.props.onUpdate(
      this.state.searchText
        ? {
            filter: {
              _or: [
                { currencySymbol_like: `%${this.state.searchText}%` },
                { currencyName_like: `%${this.state.searchText}%` },
              ],
            },
          }
        : null
    );
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <Container style={styles.modal}>
            <Button
              onPress={() => {
                this.changeSearch();
              }}
              title="Done"
            />
            <View style={styles.footer}>
              <TextInput
                value={this.state.searchText}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={searchText => {
                  console.log(searchText);
                  this.setState({ searchText });
                }}
              />
            </View>
          </Container>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <FontAwesome name="search" size={30} style={{ paddingTop: 10 }} />
        </TouchableOpacity>
      </View>
    );
  }
}

let dimensions = Dimensions.get('window');
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
});
