import React from 'react';
import { SingleDatePicker } from 'react-dates';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ date }, () => this.props.onDateChange(date));
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  render() {
    const { date, onDateChange } = this.props;
    const { focused } = this.state;

    return <SingleDatePicker
      {...this.props}
      date={date}
      focused={focused}
      onDateChange={onDateChange}
      onFocusChange={this.onFocusChange}
    />;
  }
}

export default DatePicker;
