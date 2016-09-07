import React from 'react';
import SingleDatePicker from 'react-dates';
import moment from 'moment';

class SingleDatePickerWrapper extends React.Component {
  constructor(props) {
    super(props);

    /**
     * Dirty hack =)
     */
    moment.updateLocale('en', {
      longDateFormat: {
        L: 'DD.MM.YYYY',
      },
    });
    this.state = {
      focused: false,
      date: null,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

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
