import { AsyncStorage } from 'react-native';

export const getFavorites = () => {
  return AsyncStorage.getItem('favorites').then(items => {
    items = items || '';
    return new Promise(resolve => resolve(items.split(',')));
  });
};

export const saveFavorites = items => {
  let itemString = Array.isArray(items) ? items.join(',') : items;
  return AsyncStorage.setItem('favorites', itemString);
};

export const addFavorite = name => {
  return getFavorites()
    .then(items => {
      let index = items.indexOf(name);

      if (index === -1) {
        items.push(name);
        return saveFavorites(items);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const removeFavorite = name => {
  return getFavorites()
    .then(items => {
      let index = items.indexOf(name);

      if (index > -1) {
        items.splice(index, 1);
        return saveFavorites(items);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const isFavorite = name => {
  return getFavorites()
    .then(items => {
      return items.indexOf(name) > -1;
    })
    .catch(err => {
      console.log(err);
    });
};
