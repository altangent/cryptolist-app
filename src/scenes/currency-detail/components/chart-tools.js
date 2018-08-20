import React from 'react';
import PropTypes from 'prop-types';
import moment, { min } from 'moment';
import { TouchableWithoutFeedback, Modal, StyleSheet, DatePickerIOS, View } from 'react-native';
import { CLButton } from '../../../components/button';

export const Resolutions = [
  // { display: '1m', value: '_1m', seconds: 60 },
  // { display: '5m', value: '_5m', seconds: 60 * 5 },
  // { display: '15m', value: '_15m', seconds: 60 * 15 },
  // { display: '30m', value: '_30m', seconds: 60 * 30 },
  { display: '1H', value: '_1h', seconds: 60 * 60 },
  { display: '2H', value: '_2h', seconds: 60 * 60 * 2 },
  { display: '4H', value: '_4h', seconds: 60 * 60 * 4 },
  { display: '1D', value: '_1d', seconds: 60 * 60 * 24 },
];

export class ResolutionGroup extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    resolution: PropTypes.object.isRequired,
  };

  render() {
    let resolutionViews = Resolutions.map(res => (
      <CLButton
        title={res.display}
        key={res.value}
        style={style.resolutionItem}
        onPress={() => this.props.onChange(res)}
        active={this.props.resolution.value === res.value}
      />
    ));
    return <View style={style.resolutionContainer}>{resolutionViews}</View>;
  }
}

export class StartEndGroup extends React.Component {
  constructor(props) {
    super(props);

    this.showPicker = this.showPicker.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
    this.updatePickerValue = this.updatePickerValue.bind(this);

    this.state = {
      pickerShown: false,
      pickerValue: new Date(),
      valueShown: '',
      maximumDate: new Date(),
      minimumDate: new Date(),
    };
  }

  static propTypes = {
    onChange: PropTypes.func,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  };

  showPicker(valueShown, value) {
    let minimumDate, maximumDate;
    switch (valueShown) {
      case 'start':
        minimumDate = null;
        maximumDate = moment(this.props.end * 1000)
          .subtract(1, 'days')
          .toDate();
        break;
      case 'end':
        maximumDate = null;
        minimumDate = moment(this.props.start * 1000)
          .add(1, 'days')
          .toDate();
        break;
      default:
        break;
    }
    this.setState({
      pickerShown: true,
      pickerValue: new Date(value),
      valueShown,
      maximumDate,
      minimumDate,
    });
  }

  hidePicker() {
    this.setState({ pickerShown: false });
    let start =
      this.state.valueShown === 'start'
        ? moment(this.state.pickerValue).unix()
        : moment(this.props.start * 1000).unix();
    let end =
      this.state.valueShown === 'end'
        ? moment(this.state.pickerValue).unix()
        : moment(this.props.end * 1000).unix();
    this.props.onChange(start, end);
  }

  updatePickerValue(value) {
    this.setState({ pickerValue: new Date(moment(value).toString()) });
  }

  render() {
    return (
      <View>
        <View style={style.resolutionContainer}>
          <CLButton
            title={moment(this.props.start * 1000).format('M/D/YY h:ma')}
            onPress={() => this.showPicker('start', this.props.start * 1000)}
          />
          <CLButton
            title={moment(this.props.end * 1000).format('M/D/YY h:ma')}
            onPress={() => this.showPicker('end', this.props.end * 1000)}
          />
        </View>
        {this.state.pickerShown && (
          <Modal animationType="fade" transparent={true} visible={this.state.pickerShown}>
            <TouchableWithoutFeedback onPress={this.hidePicker}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(52, 52, 52, 0.8)',
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}
                >
                  {/* <View style={{ flex: 1 }}> */}
                  <DatePickerIOS
                    mode="datetime"
                    date={this.state.pickerValue}
                    onDateChange={this.updatePickerValue}
                    isVisible={true}
                    style={{ flex: 1 }}
                    {...(this.state.minimumDate ? { minimumDate: this.state.minimumDate } : {})}
                    {...(this.state.maximumDate ? { maximumDate: this.state.maximumDate } : {})}
                  />
                  <CLButton onPress={this.hidePicker} title="Done" />
                  {/* </View> */}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create({
  picker: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'black',
  },
  resolutionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  resolutionItem: {},
});
