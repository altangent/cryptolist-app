import { createStackNavigator } from 'react-navigation';
import { Home } from './src/scenes/home/home';
import { CurrencyDetail } from './src/scenes/currency-detail/currency-detail';
import { Settings } from './src/scenes/settings/settings';
import { QuotePicker } from './src/scenes/quote-picker/quote-picker';
import { VolumeChart } from './src/scenes/volume/volume-chart';
import { RegraphRequest } from 'regraph-request';
import React from 'react';

const Navigator = createStackNavigator(
  {
    Home,
    Detail: CurrencyDetail,
    Settings,
    QuotePicker,
    VolumeChart,
  },
  {
    initialRouteName: 'Home',
  }
);

export default () => (
  <RegraphRequest value="https://alpha.blocktap.io/graphql">
    <Navigator />
  </RegraphRequest>
);
