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
    searchText: '',
  };

  static propTypes = {
    onUpdate: PropTypes.func,
  };

  submit() {
    this.props.onUpdate({
      _or: [
        { currencySymbol_like: `%${this.state.searchText}%` },
        { currencyName_like: `%${this.state.searchText}%` },
      ],
    });
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
            onCancel={() => console.log('123')}
            placeholder="Search"
            autoCorrect={false}
            autoCapitalize="none"
            clearIcon={null}
            platform="ios"
          />
        </View>
      </View>
    );
  }
}

let style = StyleSheet.create({});
