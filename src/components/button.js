import React from 'react';
import { TouchableHighlight, StyleSheet, View } from 'react-native';

export class CLButton extends React.Component {
  render() {
    return (
      <TouchableHighlight style={[style.button, this.props.style]} onPress={this.props.onPress}>
        <View style={style.view}>{this.props.children}</View>
      </TouchableHighlight>
    );
  }
}

const style = StyleSheet.create({
  button: {
    backgroundColor: '#66E9BE',
    borderRadius: 100,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
