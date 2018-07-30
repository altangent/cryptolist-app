import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { CLText } from '../../../components/cl-text';

export const CurrencyInformationItem = ({ name, value }) => {
  return (
    <View style={style.container}>
      <CLText style={style.name}>{name}</CLText>
      <CLText style={style.value}>{value}</CLText>
    </View>
  );
};

CurrencyInformationItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ITEMS_PER_ROW = 3;
const style = StyleSheet.create({
  container: {
    width: (Dimensions.get('screen').width - 40) / ITEMS_PER_ROW,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: '800',
    flex: 1,
    justifyContent: 'center',
    fontSize: 13,
  },
  value: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 11,
  },
});
