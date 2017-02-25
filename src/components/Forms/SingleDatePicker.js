import React, { Component } from 'react';
import { SingleDatePicker } from 'react-dates';

class SingleDatePickerWrapper extends Component {
  state = {
    focused: false,
    date: null,
  };

  onDateChange = (date) => {
    this.setState({ date });
  };

  onFocusChange = ({ focused }) => {
    this.setState({ focused });
  };

  render() {
    const { focused, date } = this.state;

    return (
      <SingleDatePicker
        {...this.props}
        date={date}
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}

export default SingleDatePickerWrapper;
