import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { SearchBar, Icon } from 'react-native-elements';

export class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.changeText = this.changeText.bind(this);
    this.submit = this.submit.bind(this);
  }

  state = {
    searchText: this.props.text,
  };

  static propTypes = {
    onUpdate: PropTypes.func,
    text: PropTypes.string,
  };

  submit() {
    this.props.onUpdate(`%${this.state.searchText}%`);
  }

  componentDidMount() {
    this.search.focus();
  }

  changeText(searchText) {
    this.setState({ searchText });
  }

  render() {
    return (
      <View style={this.props.style}>
        <View>
          <SearchBar
            ref={search => (this.search = search)}
            lightTheme
            onChangeText={text => this.changeText(text)}
            blurOnSubmit={true}
            onSubmitEditing={() => this.submit()}
            cancelButtonTitle="Cancel"
            placeholder="Search"
            autoCorrect={false}
            autoCapitalize="none"
            clearIcon={null}
            platform="ios"
            value={this.state.searchText}
          />
        </View>
      </View>
    );
  }
}

let style = StyleSheet.create({});
