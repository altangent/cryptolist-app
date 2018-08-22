import React from 'react';
import { View, Text } from 'react-native';

export class QuoteVolume extends React.Component {
  render() {
    console.log(this.props.navigation.getParam('volume'));
    return (
      <View>
        <Text>Quote Volume</Text>
      </View>
    );
  }
}
