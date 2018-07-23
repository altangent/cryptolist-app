import { createStackNavigator } from 'react-navigation';
import { CryptoList } from './src/scenes/currency-list/currency-list';
import { CurrencyDetail } from './src/scenes/currency-detail/currency-detail';

const App = createStackNavigator(
  {
    Home: CryptoList,
    Detail: CurrencyDetail,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null,
    },
  }
);

export default App;
