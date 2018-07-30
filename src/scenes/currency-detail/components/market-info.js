import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { CLText } from '../../../components/cl-text';
import { PieChart } from 'react-native-svg-charts';

export const MarketInfo = ({ name }) => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  const pieData = data.filter(value => value > 0).map((value, index) => ({
    value,
    svg: {
      fill: '#4a4a4a',
      onPress: () => console.log('press', index),
    },
    key: `pie-${index}`,
  }));

  return (
    <View style={style.container}>
      <PieChart style={style.circle} data={pieData} />;
      <CLText style={style.name}>{name}</CLText>
    </View>
  );
};

MarketInfo.propTypes = {
  name: PropTypes.string.isRequired,
};

const ITEMS_PER_ROW = 2;
const style = StyleSheet.create({
  container: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  circle: {
    width: (Dimensions.get('screen').width - 60) / ITEMS_PER_ROW,
    height: (Dimensions.get('screen').width - 60) / ITEMS_PER_ROW,
  },
  name: {
    flex: 1,
    fontSize: 11,
    marginTop: 20,
  },
});
