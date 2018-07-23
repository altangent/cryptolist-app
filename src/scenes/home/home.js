import React from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Container } from '../../components/container';
import { CurrencyList } from './components/currency-list';

export class Home extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../../../img/cryptolist.png')} />
          </View>
          <CurrencyList {...this.props} />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  logo: {
    width: Dimensions.get('window').width / 2,
    height: 50,
    resizeMode: Image.resizeMode.contain,
  },
});
