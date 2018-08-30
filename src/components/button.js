import React from 'react';
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export class CLButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  render() {
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={this.props.onPress}
        title={this.props.title}
        underlayColor="#9CF0DE"
        disabled={this.props.disabled}
        style={[style.view, this.props.active ? style.active : style.inactive]}
      >
        {this.props.children ? (
          <View style={style.buttonView}>{this.props.children}</View>
        ) : (
          <Text
            style={[
              style.button,
              {
                color: this.props.active ? 'white' : '#4A4A4A',
              },
            ]}
          >
            {this.props.title}
          </Text>
        )}
      </TouchableHighlight>
    );
  }
}

const style = StyleSheet.create({
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
    fontFamily: 'Menlo-Regular',
  },
  buttonView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  active: {
    backgroundColor: '#23D59B',
  },
  inactive: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
});
