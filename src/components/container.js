import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

export class Container extends React.Component {
  render() {
    return <View style={[style.container, this.props.style]}>{this.props.children}</View>;
  }
}

const style = StyleSheet.create({
  container: {
    paddingTop: 42,
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
});
