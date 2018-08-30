import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { CLButton } from '../../../components/button';
import { CLText } from '../../../components/cl-text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export class ResultListPaginator extends React.Component {
  static propTypes = {
    onBackPress: PropTypes.func,
    onForwardPress: PropTypes.func,
    forwardDisabled: PropTypes.bool,
    backDisabled: PropTypes.bool,
  };

  render() {
    return (
      <View style={style.container}>
        <CLButton onPress={this.props.onBackPress} disabled={this.props.backDisabled}>
          <View style={style.button}>
            <FontAwesome
              name="chevron-left"
              size={20}
              style={[style.buttonIcon, this.props.backDisabled ? style.disabled : null]}
            />
            <CLText style={[style.buttonText, this.props.backDisabled ? style.disabled : null]}>
              Back
            </CLText>
          </View>
        </CLButton>
        <CLButton onPress={this.props.onForwardPress} disabled={this.props.forwardDisabled}>
          <View style={style.button}>
            <CLText style={[style.buttonText, this.props.forwardDisabled ? style.disabled : null]}>
              Forward
            </CLText>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={[style.buttonIcon, this.props.forwardDisabled ? style.disabled : null]}
            />
          </View>
        </CLButton>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  buttonText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonIcon: {
    // marginTop: 5,
  },
  disabled: {
    color: '#ccc',
  },
});
