import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView, StyleSheet, Platform, Dimensions } from 'react-native';

export class Container extends React.Component {
  render() {
    let dimensions = Dimensions.get('window');
    let isIOS = Platform.OS === 'ios';
    let isiPhoneX = isIOS && (dimensions.height == 812 || dimensions.width === 812);
    return (
      <View style={[isiPhoneX ? style.iPhoneX : {}, this.props.style]}>
        <SafeAreaView>{this.props.children}</SafeAreaView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  iPhoneX: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
});
