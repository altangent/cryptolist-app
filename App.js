import { createStackNavigator } from 'react-navigation';
import { Home } from './src/scenes/home/home';
import { CurrencyDetail } from './src/scenes/currency-detail/currency-detail';
import { Settings } from './src/scenes/settings/settings';

const App = createStackNavigator(
  {
    Home: Home,
    Detail: CurrencyDetail,
    Settings: Settings,
  },
  {
    initialRouteName: 'Home',
  }
);

export default App;
