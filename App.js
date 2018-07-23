import { createStackNavigator } from 'react-navigation';
import { Home } from './src/scenes/home/home';
import { CurrencyDetail } from './src/scenes/currency-detail/currency-detail';

const App = createStackNavigator(
  {
    Home: Home,
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
