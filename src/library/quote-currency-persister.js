import { AsyncStorage } from 'react-native';

export const getQuotes = () => {
  return AsyncStorage.getItem('quotes').then(items => {
    items = items || '{"primary": "USD", "secondary": "BTC"}';
    return new Promise(resolve => resolve(JSON.parse(items)));
  });
};

export const saveQuotes = items => {
  let itemString = JSON.stringify(items);
  return AsyncStorage.setItem('quotes', itemString);
};
