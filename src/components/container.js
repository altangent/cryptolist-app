import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

export class Container extends React.Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return <View style={style.container}>{this.props.children}</View>;
  }
}

const style = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
  },
});
