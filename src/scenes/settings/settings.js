import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { QuotePickerSettingsItem } from '../quote-picker/quote-picker';
import { CLText } from '../../components/cl-text';

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.push = this.push.bind(this);
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  push(name) {
    const { navigate } = this.props.navigation;
    navigate('QuotePicker', {
      name: name,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[{ key: 'Primary' }, { key: 'Secondary' }]}
          renderItem={({ item }) => <QuotePickerSettingsItem onPress={this.push} name={item.key} />}
        />
      </View>
    );
  }
}

Settings.navigationOptions = ({ navigation }) => ({
  headerTitle: <CLText>Settings</CLText>,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
});
