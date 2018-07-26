import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, SafeAreaView, StyleSheet, Platform, Dimensions } from 'react-native';

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

export class ScrollContainer extends React.Component {
  render() {
    let dimensions = Dimensions.get('window');
    let isIOS = Platform.OS === 'ios';
    let isiPhoneX = isIOS && (dimensions.height == 812 || dimensions.width === 812);
    return (
      <ScrollView style={[style.scrollView, isiPhoneX ? style.scrollViewiPhoneX : {}]}>
        <View style={this.props.style}>{this.props.children}</View>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  iPhoneX: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 30,
  },
  scrollViewiPhoneX: {
    paddingTop: 40,
  },
});
