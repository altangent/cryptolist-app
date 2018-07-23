import React from 'react';
import { Text, StyleSheet } from 'react-native';

export class CLText extends React.Component {
  render() {
    return <Text style={[style.text, this.props.style]}>{this.props.children}</Text>;
  }
}

const style = StyleSheet.create({
  text: {
    fontFamily: 'Menlo-Regular',
  },
});
