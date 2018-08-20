import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export class CLButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    active: PropTypes.bool,
  };

  render() {
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={this.props.onPress}
        title={this.props.title}
        underlayColor="#9CF0DE"
        style={[
          style.view,
          {
            backgroundColor: this.props.active ? '#23D59B' : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            style.button,
            {
              color: this.props.active ? 'white' : '#4A4A4A',
            },
          ]}
        >
          {this.props.title}
        </Text>
      </TouchableHighlight>
    );
  }
}

const style = StyleSheet.create({
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
    fontFamily: 'Menlo-Regular',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
});
