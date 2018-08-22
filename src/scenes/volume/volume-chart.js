import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { CLText } from '../../components/cl-text';
import CryptoIcon from 'react-native-crypto-icons';

export class VolumeChart extends React.Component {
  render() {
    let data = this.props.navigation.getParam('volume');
    let formattedData = data.map(item => ({
      value: item.volume,
      key: `${item.key}`,
      svg: {
        fill: item.color,
      },
    }));
    let kind = this.props.navigation.getParam('volumeKind');
    kind = kind.slice(0, 1).toUpperCase() + kind.slice(1);
    return (
      <View style={style.container}>
        <CLText style={style.header}>Volume by {kind}</CLText>
        <PieChart style={style.circle} padAngle={0} data={formattedData} />
        <View style={style.listContainer}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={[style.row, style.listItem]}>
                <View style={[style.listColorBox, { backgroundColor: item.color }]} />
                <View>
                  <CLText>{item.name}</CLText>
                </View>
                <View>
                  <CLText>{item.volume.toFixed(2)}</CLText>
                </View>
                <View>
                  <CLText>{(item.percent * 100).toFixed(2)}%</CLText>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const TitleBar = ({ name, symbol }) => {
  return (
    <View style={style.title}>
      <CryptoIcon name={symbol.toLowerCase()} style={style.titleIcon} />
      <CLText style={style.titleText}>{name}</CLText>
    </View>
  );
};

VolumeChart.navigationOptions = ({ navigation }) => ({
  headerTitle: (
    <TitleBar
      symbol={navigation.getParam('currencySymbol')}
      name={navigation.getParam('currencyName')}
    />
  ),
});

VolumeChart.propTypes = {
  navigation: PropTypes.object,
};

const SCREEN_WIDTH = Dimensions.get('screen').width;
const style = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 20,
    color: '#4a4a4a',
    marginRight: 10,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  circle: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH - 60,
  },
  listContainer: {
    flex: 1,
    width: SCREEN_WIDTH - 20,
    marginBottom: 10,
    marginTop: 10,
  },
  listColorBox: {
    width: 40,
    height: 40,
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});
